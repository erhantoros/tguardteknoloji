import { toast } from 'react-hot-toast';

interface PayTROptions {
  merchantId: string;
  merchantKey: string;
  merchantSalt: string;
}

interface PaymentData {
  amount: number;
  basketId: string;
  currency: 'TL' | 'USD' | 'EUR';
  installment?: number;
  noInstallment?: number;
  maxInstallment?: number;
  userEmail: string;
  userAddress: string;
  userPhone: string;
  merchantOid: string;
  userBasket: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  paymentTitle?: string;
  debug?: boolean;
}

class PayTR {
  private merchantId: string;
  private merchantKey: string;
  private merchantSalt: string;
  private apiUrl = 'https://www.tguardteknoloji.com.tr/api/payment';

  constructor(options: PayTROptions) {
    this.merchantId = options.merchantId;
    this.merchantKey = options.merchantKey;
    this.merchantSalt = options.merchantSalt;
  }

  async createPayment(data: PaymentData) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          merchantId: this.merchantId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ödeme işlemi başlatılamadı');
      }

      const result = await response.json();
      
      // PayTR iframe'ini aç
      if (result.token) {
        this.openIframe(result.token);
      }

      return result;
    } catch (error: any) {
      toast.error(error.message || 'Ödeme işlemi başlatılamadı');
      throw error;
    }
  }

  private openIframe(token: string) {
    // Mevcut iframe varsa kaldır
    const existingIframe = document.getElementById('paytr-iframe');
    if (existingIframe) {
      existingIframe.remove();
    }

    // Yeni iframe oluştur
    const iframe = document.createElement('iframe');
    iframe.id = 'paytr-iframe';
    iframe.src = `https://www.paytr.com/odeme/guvenli/${token}`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    iframe.className = 'border-0';

    // Modal container oluştur
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75';
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    };

    // İframe container
    const container = document.createElement('div');
    container.className = 'relative w-full max-w-4xl h-[600px] bg-white rounded-xl shadow-2xl';
    
    // Kapat butonu
    const closeButton = document.createElement('button');
    closeButton.className = 'absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors';
    closeButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    closeButton.onclick = () => modal.remove();

    // Elementleri birleştir
    container.appendChild(iframe);
    modal.appendChild(container);
    modal.appendChild(closeButton);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Modal kapandığında scroll'u geri aç
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && !document.getElementById('paytr-iframe')) {
          document.body.style.overflow = '';
          observer.disconnect();
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }
}

export default PayTR;