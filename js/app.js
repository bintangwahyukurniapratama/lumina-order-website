document.addEventListener('DOMContentLoaded', () => {
    const categoryContainer = document.getElementById('category-container');
    const mediaGrid = document.getElementById('media-grid');
    const modal = document.getElementById('media-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalIframe = document.getElementById('modal-iframe');
    const closeModalBtn = document.getElementById('close-modal');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const searchInput = document.getElementById('search-input');
    const qrCodeImg = document.getElementById('qr-code-img');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const toastContainer = document.getElementById('toast-container');
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    // New DOM Elements for Navigation & Upload
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = {
        'beranda-section': document.getElementById('beranda-section'),
        'upload-section': document.getElementById('upload-section'),
        'publik-section': document.getElementById('publik-section')
    };
    const uploadForm = document.getElementById('upload-form');
    const submitBtn = document.getElementById('submit-upload-btn');
    const submitText = document.getElementById('submit-text');
    const tanggalInput = document.getElementById('tanggal');
    const publikGrid = document.getElementById('publik-grid');
    const publikLoading = document.getElementById('publik-loading');

    const GAS_URL = 'https://script.google.com/macros/s/AKfycbxQo8F_sf_2apQnSK75MZNwj29XhRv5ej7jyATxMadADJ2B0W4g3FUTOrq7s0QZeoslQw/exec';

    // --- Theme Toggle Logic ---
    const themeToggles = document.querySelectorAll('.theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
    }

    themeToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            document.body.classList.toggle('dark');
            const isDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    });

    // --- Navigation Logic (SPA) ---
    function navigateTo(sectionId) {
        // Hide all sections
        Object.values(sections).forEach(section => {
            if (section) section.classList.add('hidden');
        });
        // Show target section
        if (sections[sectionId]) {
            sections[sectionId].classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Close mobile menu if open
        navMenu.classList.add('hidden');
        navMenu.classList.remove('flex');
        
        // Fetch public data if navigating to publik-section
        if (sectionId === 'publik-section') {
            fetchPublicData();
        }
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('hidden');
            navMenu.classList.toggle('flex');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            if (target) {
                navigateTo(target);
            }
        });
    });

    // --- Upload Form Logic ---
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Set current date
            const now = new Date();
            const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            tanggalInput.value = formattedDate;

            const formData = new FormData(uploadForm);
            
            // Loading state
            submitBtn.disabled = true;
            submitText.textContent = 'MENGIRIM...';
            submitBtn.classList.add('opacity-70', 'cursor-not-allowed');

            fetch(GAS_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            })
            .then(res => {
                // Dengan mode 'no-cors', response bersifat opaque (tidak bisa dibaca statusnya), 
                // tapi request berhasil dikirim ke Google Script.
                showToast('Karya berhasil di-upload!', 'success');
                uploadForm.reset();
                navigateTo('beranda-section');
            })
            .catch(error => {
                console.error('Error!', error.message);
                showToast('Gagal mengirim data. Periksa koneksi internet Anda.', 'warning');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitText.textContent = 'UPLOAD SEKARANG';
                submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
            });
        });
    }

    // --- Public Data Fetching Logic ---
    function fetchPublicData() {
        if (!publikGrid) return;
        
        publikGrid.innerHTML = '';
        publikLoading.classList.remove('hidden');

        fetch(GAS_URL)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then(data => {
                publikLoading.classList.add('hidden');
                
                // Assuming data is an array of objects or an object containing data array
                let items = [];
                if (Array.isArray(data)) {
                    items = data;
                } else if (data && data.data && Array.isArray(data.data)) {
                    items = data.data;
                } else {
                    throw new Error('Format data tidak sesuai');
                }

                if (items.length === 0) {
                    publikGrid.innerHTML = `<div class="col-span-full text-center py-10 font-bold text-gray-500 border-[3px] border-black bg-white shadow-neo">Belum ada karya publik.</div>`;
                    return;
                }

                items.reverse().forEach((item, index) => {
                    // Normalize keys since sheet columns might have spaces
                    const judul = item['Judul'] || item['judul'] || 'Tanpa Judul';
                    const kategori = item['Kategori'] || item['kategori'] || 'Umum';
                    const link = item['Link'] || item['link'] || '#';
                    const deskripsi = item['Deskripsi Singkat'] || item['deskripsi singkat'] || item['deskripsi'] || '';
                    const nama = item['Nama Pembuat'] || item['nama pembuat'] || 'Anonim';
                    
                    const rotation = Math.random() > 0.5 ? 'rotate-1' : '-rotate-1';
                    
                    const card = document.createElement('div');
                    card.style.animationDelay = `${index * 0.05}s`;
                    card.className = `bg-white dark:bg-slate-800 border-[3px] border-black dark:border-white shadow-neo dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex flex-col ${rotation} 
                                      transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-neo-hover dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] group relative opacity-0 animate-fade-in-up rounded-3xl overflow-hidden`;
                    
                    // Generate a random color based on string length to make cards colorful
                    const colors = ['bg-neo-yellow', 'bg-neo-blue', 'bg-neo-pink', 'bg-neo-green'];
                    const colorClass = colors[judul.length % colors.length];

                    card.innerHTML = `
                        <div class="h-16 border-b-[3px] border-black dark:border-white flex items-center justify-center font-black text-xl uppercase ${colorClass} dark:text-black">
                            KARYA PUBLIK
                        </div>
                        <div class="p-5 flex-grow flex flex-col">
                            <div class="flex justify-between items-start mb-3">
                                <span class="inline-block px-3 py-1 bg-neo-blue border-[2px] border-black dark:border-white text-xs font-black uppercase break-words rounded-full dark:text-black">
                                    ${kategori}
                                </span>
                                <span class="text-xs font-bold text-gray-600 dark:text-black bg-white px-3 py-1 border-[2px] border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] rounded-full">
                                    By: ${nama}
                                </span>
                            </div>
                            <h3 class="text-lg md:text-xl font-black mb-2 leading-tight break-words dark:text-white">${judul}</h3>
                            <p class="font-medium text-sm md:text-base mb-5 flex-grow break-words text-gray-700 dark:text-gray-300">${deskripsi}</p>
                            <a href="${link}" target="_blank" rel="noopener noreferrer" class="w-full py-3 px-4 rounded-full bg-neo-yellow dark:text-black text-center font-black text-sm md:text-base border-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all mt-auto break-words inline-block">
                                BUKA LINK
                            </a>
                        </div>
                    `;
                    publikGrid.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                publikLoading.classList.add('hidden');
                publikGrid.innerHTML = `
                    <div class="col-span-full text-center py-10 font-bold text-red-500 border-[3px] border-black bg-white shadow-neo">
                        Gagal memuat data. Mohon pastikan Google Apps Script mendukung metode GET. <br>
                        Error: ${error.message}
                    </div>
                `;
            });
    }



    let activeCategory = 'Semua';
    let searchQuery = '';
    
    // Initialize favorites from localStorage
    let favorites = JSON.parse(localStorage.getItem('lumina_favorites')) || [];
    // Initialize view counts from localStorage
    let localViews = JSON.parse(localStorage.getItem('lumina_views')) || {};

    function saveFavorites() {
        localStorage.setItem('lumina_favorites', JSON.stringify(favorites));
    }

    function saveViews() {
        localStorage.setItem('lumina_views', JSON.stringify(localViews));
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-400' : 'bg-[#FFC900]';
        toast.className = `p-4 font-black border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${bgColor} text-black toast-enter z-50`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('toast-enter');
            toast.classList.add('toast-exit');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 3000);
    }

    function toggleFavorite(id) {
        if (favorites.includes(id)) {
            favorites = favorites.filter(favId => favId !== id);
            showToast('Dihapus dari Favorit', 'warning');
        } else {
            favorites.push(id);
            showToast('Ditambahkan ke Favorit', 'success');
        }
        saveFavorites();
        renderCards(); // Re-render to update UI
    }

    // Attach event listeners to filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    function updateFilterButtons() {
        filterBtns.forEach(btn => {
            const category = btn.getAttribute('data-category');
            const iconContainer = btn.querySelector('div');
            if (!iconContainer) return;

            if (category === activeCategory) {
                // Active state
                iconContainer.classList.remove('bg-white');
                iconContainer.classList.add('bg-black', 'text-white', 'translate-x-0.5', 'translate-y-0.5', 'shadow-none');
            } else {
                // Inactive state
                iconContainer.classList.remove('bg-black', 'text-white', 'translate-x-0.5', 'translate-y-0.5', 'shadow-none');
                iconContainer.classList.add('bg-white', 'text-black');
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            activeCategory = btn.getAttribute('data-category');
            updateFilterButtons();
            renderCards();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase();
            renderCards();
        });
    }

    // Render Media Cards
    function renderCards() {
        mediaGrid.innerHTML = '';
        
        let filteredData = mediaData;
        
        // Filter by category
        if (activeCategory === 'Favorit') {
            filteredData = filteredData.filter(item => favorites.includes(item.id));
        } else if (activeCategory !== 'Semua') {
            filteredData = filteredData.filter(item => item.kategori === activeCategory);
        }

        // Filter by search query
        if (searchQuery) {
            filteredData = filteredData.filter(item => 
                item.judul.toLowerCase().includes(searchQuery) || 
                item.deskripsi.toLowerCase().includes(searchQuery)
            );
        }
        
        if (filteredData.length === 0) {
            mediaGrid.innerHTML = `<div class="col-span-full text-center py-10 font-bold text-gray-500 border-[3px] border-black bg-white shadow-neo mt-4">Tidak ada karya yang ditemukan.</div>`;
            return;
        }

        filteredData.forEach((item, index) => {
            const rotation = Math.random() > 0.5 ? 'rotate-1' : '-rotate-1';
            const isFav = favorites.includes(item.id);
            const favIcon = isFav 
                ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-neo-yellow"><path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.966.59-2.195-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" /></svg>' 
                : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>';
            const author = item.author || 'Anonim';
            const views = localViews[item.id] !== undefined ? localViews[item.id] : (item.views || 0);
            
            const card = document.createElement('div');
            // Adding staggered animation delay
            card.style.animationDelay = `${index * 0.05}s`;
            card.className = `bg-white dark:bg-slate-800 border-[3px] border-black dark:border-white shadow-neo dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] flex flex-col ${rotation} 
                              transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-neo-hover dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] group relative opacity-0 animate-fade-in-up rounded-3xl overflow-hidden`;
            
            card.innerHTML = `
                <div class="h-48 border-b-[3px] border-black dark:border-white overflow-hidden bg-gray-200 relative flex-shrink-0">
                    <img src="${item.thumbnail}" alt="${item.judul}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                    <button data-id="${item.id}" class="fav-btn absolute top-3 right-3 bg-white border-[3px] border-black dark:border-white w-10 h-10 rounded-full flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none hover:bg-gray-100 dark:hover:bg-gray-200 z-10 transition-all text-black">
                        ${favIcon}
                    </button>
                    <div class="absolute bottom-3 left-3 bg-white rounded-full border-[2px] border-black dark:border-white px-3 py-1 flex items-center gap-1 font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] text-black">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4 text-black"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        ${views}
                    </div>
                </div>
                <div class="p-5 flex-grow flex flex-col">
                    <div class="flex justify-between items-start mb-3">
                        <span class="inline-block px-3 py-1 bg-neo-blue rounded-full border-[2px] border-black dark:border-white text-xs font-black uppercase break-words dark:text-black">
                            ${item.kategori}
                        </span>
                        <span class="text-xs font-bold text-gray-600 dark:text-black bg-white px-3 py-1 border-[2px] border-black dark:border-white rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                            By: ${author}
                        </span>
                    </div>
                    <h3 class="text-lg md:text-xl font-black mb-2 leading-tight break-words dark:text-white">${item.judul}</h3>
                    <p class="font-medium text-sm md:text-base mb-5 flex-grow break-words text-gray-700 dark:text-gray-300">${item.deskripsi}</p>
                    <button data-id="${item.id}" class="open-media-btn w-full py-3 px-4 rounded-full bg-neo-yellow dark:text-black font-black text-sm md:text-base border-[3px] border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all mt-auto break-words">
                        BUKA MEDIA
                    </button>
                </div>
            `;
            mediaGrid.appendChild(card);
        });

        // Attach event listeners to new buttons
        document.querySelectorAll('.open-media-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const mediaItem = mediaData.find(m => m.id === id);
                if (mediaItem) {
                    openModal(mediaItem);
                }
            });
        });

        document.querySelectorAll('.fav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = e.currentTarget.getAttribute('data-id');
                toggleFavorite(id);
            });
        });
    }

    let currentMediaLink = '';

    // Modal Logic
    function openModal(item) {
        modalTitle.textContent = item.judul;
        modalIframe.src = item.linkMedia;
        currentMediaLink = item.linkMedia;
        
        // Update View Counter
        let currentViews = localViews[item.id] !== undefined ? localViews[item.id] : (item.views || 0);
        localViews[item.id] = currentViews + 1;
        saveViews();
        // Don't re-render entire grid immediately to avoid jank, it will update on next filter/search or page load

        // Generate QR code using public API
        if (qrCodeImg) {
            qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(item.linkMedia)}`;
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        modalIframe.src = ''; // Stop video playback
        if (qrCodeImg) qrCodeImg.src = '';
        currentMediaLink = '';
        document.body.style.overflow = '';
        renderCards(); // Update views when modal closes
    }

    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', () => {
            if (currentMediaLink) {
                navigator.clipboard.writeText(currentMediaLink).then(() => {
                    const originalText = copyLinkBtn.textContent;
                    copyLinkBtn.textContent = 'TER-SALIN!';
                    copyLinkBtn.classList.remove('bg-[#FF90E8]');
                    copyLinkBtn.classList.add('bg-green-400');
                    showToast('Link Berhasil Disalin!', 'success');
                    
                    setTimeout(() => {
                        copyLinkBtn.textContent = originalText;
                        copyLinkBtn.classList.add('bg-[#FF90E8]');
                        copyLinkBtn.classList.remove('bg-green-400');
                    }, 2000);
                });
            }
        });
    }

    // Fullscreen Logic for Iframe
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (modalIframe.requestFullscreen) {
                modalIframe.requestFullscreen();
            } else if (modalIframe.mozRequestFullScreen) {
                modalIframe.mozRequestFullScreen();
            } else if (modalIframe.webkitRequestFullscreen) {
                modalIframe.webkitRequestFullscreen();
            } else if (modalIframe.msRequestFullscreen) {
                modalIframe.msRequestFullscreen();
            }
        });
    }

    // Scroll to top functionality
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.remove('hidden');
            } else {
                scrollToTopBtn.classList.add('hidden');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Scroll Reveal Animation Observer
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "0px 0px -50px 0px"
    });

    // Observe all elements with .scroll-reveal class
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // We also need to observe newly created cards in the grid.
    // The easiest way is to apply the revealObserver inside renderCards and fetchPublicData.
    // But since they already have animate-fade-in-up, the CSS handles their entrance.
    // However, if we want them to reveal on scroll, we can attach observer.
    // Let's modify renderCards to attach observer to newly created cards if we want,
    // but the CSS animate-fade-in-up already runs on mount. So observing static sections is enough.

    // Initial render
    updateFilterButtons();
    renderCards();
});

