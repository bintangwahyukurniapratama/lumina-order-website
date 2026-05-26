document.addEventListener('DOMContentLoaded', () => {
    const categoryContainer = document.getElementById('category-container');
    const mediaGrid = document.getElementById('media-grid');
    const modal = document.getElementById('media-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalIframe = document.getElementById('modal-iframe');
    const closeModalBtn = document.getElementById('close-modal');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    let activeCategory = 'Semua';

    // Attach event listeners to hardcoded filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    function updateFilterButtons() {
        filterBtns.forEach(btn => {
            const category = btn.getAttribute('data-category');
            if (category === activeCategory) {
                btn.className = 'filter-btn py-3 px-6 font-black border-[3px] border-black transition-all flex-shrink-0 bg-black text-white translate-x-1 translate-y-1';
            } else {
                btn.className = 'filter-btn py-3 px-6 font-black border-[3px] border-black transition-all flex-shrink-0 bg-white shadow-neo active:translate-x-1 active:translate-y-1 active:shadow-none hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-hover';
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

    // Render Media Cards
    function renderCards() {
        mediaGrid.innerHTML = '';
        const filteredData = activeCategory === 'Semua' ? mediaData : mediaData.filter(item => item.kategori === activeCategory);
        
        filteredData.forEach(item => {
            // Generate subtle random rotation for Card Stack Vibe (-1deg or 1deg)
            const rotation = Math.random() > 0.5 ? 'rotate-1' : '-rotate-1';
            
            const card = document.createElement('div');
            card.className = `bg-white border-[3px] border-black shadow-neo flex flex-col ${rotation} 
                              transition-all duration-150 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-neo-hover group`;
            
            card.innerHTML = `
                <div class="h-48 border-b-[3px] border-black overflow-hidden bg-gray-200">
                    <img src="${item.thumbnail}" alt="${item.judul}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                </div>
                <div class="p-4 flex-grow flex flex-col">
                    <span class="inline-block px-2 py-1 bg-[#22D3EE] border-[3px] border-black text-xs font-black self-start mb-2 uppercase">${item.kategori}</span>
                    <h3 class="text-xl font-black mb-2 leading-tight">${item.judul}</h3>
                    <p class="font-medium text-sm mb-4 flex-grow">${item.deskripsi}</p>
                    <button data-id="${item.id}" class="open-media-btn w-full py-3 px-4 bg-[#FFC900] font-black border-[3px] border-black shadow-neo active:translate-x-1 active:translate-y-1 active:shadow-none transition-all mt-auto">
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
                if (mediaItem) openModal(mediaItem);
            });
        });
    }

    // Modal Logic
    function openModal(item) {
        modalTitle.textContent = item.judul;
        modalIframe.src = item.linkMedia;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        modalIframe.src = ''; // Stop video playback
        document.body.style.overflow = '';
    }

    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Fullscreen Logic for Iframe
    fullscreenBtn.addEventListener('click', () => {
        if (modalIframe.requestFullscreen) {
            modalIframe.requestFullscreen();
        } else if (modalIframe.mozRequestFullScreen) { /* Firefox */
            modalIframe.mozRequestFullScreen();
        } else if (modalIframe.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            modalIframe.webkitRequestFullscreen();
        } else if (modalIframe.msRequestFullscreen) { /* IE/Edge */
            modalIframe.msRequestFullscreen();
        }
    });

    // Initial render
    updateFilterButtons();
    renderCards();
});
