// Câu 2: viết JavaScript tại đây

const API_URL = 'http://localhost:4000';

// Hàm có sẵn: đổi giờ UTC sang giờ Việt Nam, vd "08:00 12/09/2026"
const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

// a) 
const formatSeats = (event) => {
  const capacity = event?.capacity ?? 0;
  const registeredCount = event?.registeredCount ?? 0;
  const remaining = capacity - registeredCount;
  if (remaining > 0) {
    return `Còn ${remaining}/${capacity} chỗ`;
  }
  return 'Hết chỗ';
};

// b) 
const renderEvents = (events = []) => {
  const eventList = document.getElementById('event-list');
  if (!eventList) return;

  const eventCards = events.map((event) => {
    const article = document.createElement('article');
    article.setAttribute('class', 'event-card');

    // 1. Ảnh minh họa (có alt)
    const img = document.createElement('img');
    img.setAttribute('src', 'img/event.svg');
    img.setAttribute('alt', `Minh họa ${event.name}`);

    const h3 = document.createElement('h3');
    const a = document.createElement('a');
    a.setAttribute('href', `event-detail.html?id=${event.id}`);
    a.textContent = event.name;
    h3.appendChild(a);

    // 3. Time
    const pTime = document.createElement('p');
    pTime.textContent = 'Thời gian: ';
    const time = document.createElement('time');
    time.setAttribute('datetime', event.startTime);
    time.textContent = typeof formatDateTime === 'function' ? formatDateTime(event.startTime) : event.startTime;
    pTime.appendChild(time);

    // 4. Location
    const pLocation = document.createElement('p');
    pLocation.textContent = `Địa điểm: ${event.location}`;

    // 5. Số chỗ
    const pSeats = document.createElement('p');
    pSeats.textContent = `Số chỗ: ${formatSeats(event)}`;

    article.appendChild(img);
    article.appendChild(h3);
    article.appendChild(pTime);
    article.appendChild(pLocation);
    article.appendChild(pSeats);

    // Card có nhãn “Hết chỗ”
    const capacity = event?.capacity ?? 0;
    const registeredCount = event?.registeredCount ?? 0;
    if (capacity - registeredCount <= 0) {
      const badge = document.createElement('span');
      badge.setAttribute('class', 'badge');
      badge.textContent = 'Hết chỗ';
      article.appendChild(badge);
    }

    return article;
  });

  // Thay nội dung cũ của #event-list bằng replaceChildren
  eventList.replaceChildren(...eventCards);
};

// c) 
const loadEvents = async (keyword = '') => {
  const statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.textContent = 'Đang tải…';
  }

  try {
    const params = new URLSearchParams({ pageSize: '50' });
    const trimmedKeyword = (keyword || '').trim();
    if (trimmedKeyword !== '') {
      params.append('q', trimmedKeyword);
    }

    const response = await fetch(`${API_URL}/api/events?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Lỗi máy chủ: ${response.status}`);
    }

    const data = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];

    if (items.length === 0) {
      if (statusEl) {
        statusEl.textContent = 'Không có sự kiện nào khớp từ khoá.';
      }
      renderEvents([]);
    } else {
      if (statusEl) {
        statusEl.textContent = `Tìm thấy ${items.length} sự kiện`;
      }
      renderEvents(items);
    }
  } catch (error) {
    if (statusEl) {
      statusEl.textContent = 'Không tải được dữ liệu, vui lòng thử lại.';
    }
    console.error(error);
  }
};

// Gọi khi gửi form: chặn tải lại trang và cắt khoảng trắng từ khoá
const searchForm = document.getElementById('search-form');
const keywordInput = document.getElementById('keyword');

if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const keyword = keywordInput ? keywordInput.value.trim() : '';
    loadEvents(keyword);
  });
}

// Gọi khi mở trang
loadEvents();
