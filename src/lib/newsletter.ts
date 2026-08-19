import Swal from 'sweetalert2'

export function attachNewsletter(form: HTMLFormElement | null, onSuccess?: () => void) {
  if (!form) return
  const csEmail = form.dataset.csEmail
  const source = form.dataset.source || ''
  const list = form.dataset.list || ''
  const isPromo = list === 'popup'

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const btn = form.querySelector('button')!

    const confirmed = await Swal.fire({
      icon: 'question',
      title: 'Konfirmasi Email',
      text: isPromo
        ? `Pastikan alamat email yang Anda masukkan sudah benar dan masih aktif. Info promo akan dikirim ke ${email}`
        : `Pastikan alamat email yang Anda masukkan sudah benar dan masih aktif. Newsletter akan dikirim ke ${email}`,
      showCancelButton: true,
      confirmButtonText: 'Ya, daftarkan',
      cancelButtonText: 'Perbaiki dulu',
      reverseButtons: true,
    })
    if (!confirmed.isConfirmed) return

    const token =
      (form.querySelector('[name="cf-turnstile-response"]') as HTMLInputElement)?.value || ''
    const hp = (form.elements.namedItem('_hp') as HTMLInputElement)?.value || ''

    btn.disabled = true
    Swal.fire({
      title: 'Sedang Memproses...',
      text: 'Mohon tunggu sebentar, kami sedang mendaftarkan email Anda.',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    })

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, _hp: hp, source, list }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        await Swal.fire({
          icon: 'error',
          title: 'Pendaftaran Gagal',
          text:
            data.error ??
            'Maaf, terjadi kendala saat memproses pendaftaran. Silakan coba lagi beberapa saat nanti.',
          confirmButtonText: 'Tutup',
        })
        return
      }

      if (data.status === 'already') {
        await Swal.fire({
          icon: 'info',
          title: 'Email Sudah Terdaftar',
          text: 'Email ini sudah terdaftar sebagai pelanggan newsletter ONDA. Nantikan informasi dan update terbaru dari kami.',
          confirmButtonText: 'Mengerti',
        })
      } else if (data.status === 'unsubscribed') {
        await Swal.fire({
          icon: 'info',
          title: 'Email Pernah Berhenti Berlangganan',
          text: `Email ini sebelumnya telah berhenti berlangganan newsletter ONDA. Jika ingin berlangganan kembali, silakan hubungi kami melalui ${csEmail}.`,
          confirmButtonText: 'Mengerti',
        })
      } else {
        await Swal.fire({
          icon: 'success',
          title: isPromo ? 'Berhasil Terdaftar! 🎉' : 'Selamat Datang di Newsletter ONDA! 🎉',
          text: isPromo
            ? 'Email kamu sudah masuk. Nantikan info dan penawaran spesial dari ONDA di inbox kamu.'
            : 'Terima kasih telah berlangganan. Kami telah mengirimkan email selamat datang ke inbox Anda. Nantikan update produk terbaru, promo, dan berbagai informasi menarik dari ONDA.',
          confirmButtonText: 'Oke',
        })
        form.reset()
        onSuccess?.()
      }
    } catch {
      await Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Kami tidak dapat menghubungi server saat ini. Silakan periksa koneksi internet Anda dan coba lagi.',
        confirmButtonText: 'Oke',
      })
    } finally {
      btn.disabled = false
      ;(window as any).turnstile?.reset()
    }
  })
}
