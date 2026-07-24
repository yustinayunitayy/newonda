import Swal from 'sweetalert2'

type Get = (name: string) => string

export function initWaForm(
  formId: string,
  buildMessage: (get: Get) => string,
  successHtml = 'Pesan Anda sudah berhasil disiapkan.<br> Silakan tekan tombol <b>Kirim</b> di WhatsApp untuk melanjutkan.',
  storeType?: 'contact' | 'mitra'
) {
  const form = document.getElementById(formId) as HTMLFormElement | null
  if (!form) return

  const phone = form.querySelector<HTMLInputElement>('input[name="phone"]')
  phone?.addEventListener('input', () => {
    phone.value = phone.value.replace(/\D/g, '')
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    const wa = form.dataset.wa
    if (!wa) {
      Swal.fire({
        icon: 'error',
        title: 'Kontak Belum Tersedia',
        text: 'Nomor WhatsApp tujuan belum dikonfigurasi. Silakan hubungi administrator',
      })
      return
    }

    const data = new FormData(form)
    const get: Get = (name) => (data.get(name) || '').toString().trim()

    if (storeType) {
      const payload: Record<string, string> = { type: storeType, page: location.pathname }
      data.forEach((v, k) => (payload[k] = v.toString()))
      fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {})
    }

    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(buildMessage(get))}`, '_blank')

    Swal.fire({
      icon: 'success',
      title: 'Siap Dikirim! 🚀',
      html: successHtml,
      confirmButtonText: 'Oke, mengerti',
    })

    form.reset()
  })
}
