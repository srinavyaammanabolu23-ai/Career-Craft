// ======================================
// UI Helper Functions
// ======================================

const UI = {

    show(element) {

        element.style.display = "flex";

        requestAnimationFrame(() => {

            element.style.opacity = "1";

        });

    },

    hide(element) {

        element.style.opacity = "0";

        setTimeout(() => {

            element.style.display = "none";

        }, 400);

    }

};