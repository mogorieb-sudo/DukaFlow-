// ==========================================
// DUKAFLOW NOTIFICATION SYSTEM
// ==========================================

(function () {

    // ======================================
    // TOAST CONTAINER
    // ======================================

    function getContainer() {

        let container =
            document.getElementById(
                "dukaToastContainer"
            );

        if (!container) {

            container =
                document.createElement("div");

            container.id =
                "dukaToastContainer";

            document.body.appendChild(
                container
            );

        }

        return container;
    }


    // ======================================
    // SHOW TOAST
    // ======================================

    function showToast(
        message,
        type = "info",
        duration = 3500
    ) {

        const container =
            getContainer();


        const toast =
            document.createElement("div");


        toast.className =
            "duka-toast duka-" + type;


        let icon = "ℹ";

        if (type === "success") {
            icon = "✓";
        }

        if (type === "error") {
            icon = "×";
        }

        if (type === "warning") {
            icon = "!";
        }


        toast.innerHTML = `

            <div class="duka-toast-icon">
                ${icon}
            </div>

            <div class="duka-toast-content">

                <strong class="duka-toast-title">
                    ${getTitle(type)}
                </strong>

                <div class="duka-toast-message">
                    ${message}
                </div>

            </div>

            <button
                type="button"
                class="duka-toast-close"
            >
                ×
            </button>

            <div class="duka-toast-progress"></div>

        `;


        container.appendChild(
            toast
        );


        // Animate in

        requestAnimationFrame(
            function () {

                toast.classList.add(
                    "duka-toast-show"
                );

            }
        );


        // Close button

        const closeButton =
            toast.querySelector(
                ".duka-toast-close"
            );


        closeButton.onclick =
            function () {

                removeToast(
                    toast
                );

            };


        // Automatic removal

        const timer =
            setTimeout(
                function () {

                    removeToast(
                        toast
                    );

                },
                duration
            );


        // Progress animation

        const progress =
            toast.querySelector(
                ".duka-toast-progress"
            );


        progress.style.animationDuration =
            duration + "ms";


        function removeToast(
            element
        ) {

            clearTimeout(
                timer
            );


            element.classList.remove(
                "duka-toast-show"
            );


            setTimeout(
                function () {

                    if (
                        element.parentNode
                    ) {

                        element.parentNode.removeChild(
                            element
                        );

                    }

                },
                300
            );

        }

    }


    // ======================================
    // TITLES
    // ======================================

    function getTitle(type) {

        if (type === "success") {
            return "Success";
        }

        if (type === "error") {
            return "Something went wrong";
        }

        if (type === "warning") {
            return "Warning";
        }

        return "DukaFlow";

    }


    // ======================================
    // CONFIRMATION MODAL
    // ======================================

    function confirmAction(options = {}) {

        return new Promise(
            function (resolve) {

                const title =
                    options.title ||
                    "Confirm Action";


                const message =
                    options.message ||
                    "Are you sure you want to continue?";


                const confirmText =
                    options.confirmText ||
                    "Confirm";


                const cancelText =
                    options.cancelText ||
                    "Cancel";


                const type =
                    options.type ||
                    "warning";


                let icon = "!";


                if (type === "delete") {
                    icon = "🗑️";
                }

                else if (type === "archive") {
                    icon = "📦";
                }

                else if (type === "restore") {
                    icon = "♻️";
                }

                else if (type === "warning") {
                    icon = "!";
                }


                const overlay =
                    document.createElement(
                        "div"
                    );


                overlay.className =
                    "duka-modal-overlay";


                overlay.innerHTML = `

                    <div
                        class="duka-confirm-modal"
                    >

                        <div
                            class="duka-modal-icon duka-modal-${type}"
                        >
                            ${icon}
                        </div>

                        <h2>
                            ${title}
                        </h2>

                        <p>
                            ${message}
                        </p>

                        <div
                            class="duka-modal-actions"
                        >

                            <button
                                type="button"
                                class="duka-modal-cancel"
                            >
                                ${cancelText}
                            </button>

                            <button
                                type="button"
                                class="duka-modal-confirm duka-confirm-${type}"
                            >
                                ${confirmText}
                            </button>

                        </div>

                    </div>

                `;


                document.body.appendChild(
                    overlay
                );


                const cancelButton =
                    overlay.querySelector(
                        ".duka-modal-cancel"
                    );


                const confirmButton =
                    overlay.querySelector(
                        ".duka-modal-confirm"
                    );


                function close(
                    result
                ) {

                    overlay.classList.remove(
                        "duka-modal-visible"
                    );


                    setTimeout(
                        function () {

                            if (
                                overlay.parentNode
                            ) {

                                overlay.parentNode.removeChild(
                                    overlay
                                );

                            }

                            resolve(
                                result
                            );

                        },
                        250
                    );

                }


                cancelButton.onclick =
                    function () {

                        close(false);

                    };


                confirmButton.onclick =
                    function () {

                        close(true);

                    };


                overlay.onclick =
                    function (event) {

                        if (
                            event.target ===
                            overlay
                        ) {

                            close(false);

                        }

                    };


                document.addEventListener(
                    "keydown",
                    function escapeHandler(
                        event
                    ) {

                        if (
                            event.key ===
                            "Escape"
                        ) {

                            document.removeEventListener(
                                "keydown",
                                escapeHandler
                            );

                            close(false);

                        }

                    }
                );


                requestAnimationFrame(
                    function () {

                        overlay.classList.add(
                            "duka-modal-visible"
                        );

                        confirmButton.focus();

                    }
                );

            }
        );

    }


    // ======================================
    // PUBLIC DUKAFLOW API
    // ======================================

    window.DukaNotify = {

        success:
            function (message, duration) {

                showToast(
                    message,
                    "success",
                    duration
                );

            },


        error:
            function (message, duration) {

                showToast(
                    message,
                    "error",
                    duration
                );

            },


        warning:
            function (message, duration) {

                showToast(
                    message,
                    "warning",
                    duration
                );

            },


        info:
            function (message, duration) {

                showToast(
                    message,
                    "info",
                    duration
                );

            },


        confirm:
            confirmAction

    };

})();