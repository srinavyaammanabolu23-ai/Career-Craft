 // --- Resources Page Logic ---
        const filterTabs = document.querySelectorAll('.filter-tab');
        const resourceCards = document.querySelectorAll('.resource-list .resource-card');

        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const filter = tab.dataset.filter;
                resourceCards.forEach(card => {
                    card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'flex' : 'none';
                });
            });
        });

         learningResourcesBtn.addEventListener('click', () => { showPage(resourcesPage); });