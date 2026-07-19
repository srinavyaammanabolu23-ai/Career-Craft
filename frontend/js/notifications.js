// --- Streak and Notification Logic ---
        function updateStreak() {
            let streak = parseInt(localStorage.getItem('streakCount')) || 0;
            const lastLogin = localStorage.getItem('lastLoginDate');
            const today = new Date().toISOString().split('T')[0];

            if (lastLogin) {
                const lastLoginDate = new Date(lastLogin);
                const todayDate = new Date(today);
                
                const diffTime = todayDate - lastLoginDate;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    streak++; 
                } else if (diffDays > 1) {
                    streak = 1;
                }
            } else {
                streak = 1;
            }

            localStorage.setItem('streakCount', streak);
            localStorage.setItem('lastLoginDate', today);
            streakCountSpan.textContent = streak;
        }

        function setupNotifications() {
            if (!('Notification' in window)) {
                return;
            }

            if (Notification.permission === 'default' && !localStorage.getItem('notificationDismissed')) {
                 notificationModal.style.display = 'flex';
            }
        }

        allowNotificationsBtn.addEventListener('click', () => {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    setTimeout(() => {
                         const streak = localStorage.getItem('streakCount') || 1;
                         new Notification('Career Craft Reminder', {
                            body: `🔥 Keep your ${streak}-day streak going! Time to continue your learning journey.`,
                            icon: 'https://placehold.co/128x128/3498db/ffffff?text=CC'
                         });
                    }, 5000); 
                }
            });
            notificationModal.style.display = 'none';
        });

        dismissNotificationsBtn.addEventListener('click', () => {
             localStorage.setItem('notificationDismissed', 'true');
             notificationModal.style.display = 'none';
        });