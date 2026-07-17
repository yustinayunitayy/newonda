import Swal from 'sweetalert2'

type Get = (name: string) => string

export function initWaForm(
  formId: string,
  buildMessage: (get: Get) => string,
  successHtml = 'Pesanmu sudah otomatis disiapkan.<br/>Tinggal tekan tombol <b>Kirim</b> di WhatsApp ya 🙏',
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
        title: 'Nomor WhatsApp belum diset',
        text: 'Hubungi admin untuk melengkapi kontak.',
      })
      return
    }

    const data = new FormData(form)
    const get: Get = (name) => (data.get(name) || '').toString().trim()

    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(buildMessage(get))}`, '_blank')

    Swal.fire({
      icon: 'success',
      title: 'Mengarahkan ke WhatsApp...',
      html: successHtml,
      confirmButtonText: 'Oke, mengerti',
    })

    form.reset()
  })
}