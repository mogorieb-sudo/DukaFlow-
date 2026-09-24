const CACHE_NAME = "dukaflow-v3";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./login.html",
    "./team.html",
    "./staff-register.html",
    "./products.html",
    "./sales.html",
    "./expenses.html",
    "./reports.html",
    "./style.css",
    "./auth-guard.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];


// =========================================
// INSTALL
// =========================================

self.addEventListener(
    "install",
    function(event) {

        event.waitUntil(

            caches.open(CACHE_NAME)
                .then(function(cache) {

                    return cache.addAll(
                        FILES_TO_CACHE
                    );

                })

        );

        self.skipWaiting();

    }
);


// =========================================
// ACTIVATE
// =========================================

self.addEventListener(
    "activate",
    function(event) {

        event.waitUntil(

            caches.keys()
                .then(function(cacheNames) {

                    return Promise.all(

                        cacheNames.map(
                            function(cacheName) {

                                if (
                                    cacheName !==
                                    CACHE_NAME
                                ) {

                                    return caches.delete(
                                        cacheName
                                    );

                                }

                            }
                        )

                    );

                })
                .then(function() {

                    return self.clients.claim();

                })

        );

    }
);


// =========================================
// FETCH
// =========================================

self.addEventListener(
    "fetch",
    function(event) {

        /*
         Never cache HTML pages.

         This prevents Netlify from serving
         an old dashboard/login/team version.
        */

        if (
            event.request.method !==
            "GET"
        ) {

            return;

        }


        const requestURL =
            new URL(
                event.request.url
            );


        if (
            requestURL.origin ===
            self.location.origin
        ) {

            if (
                requestURL.pathname.endsWith(
                    ".html"
                ) ||
                requestURL.pathname ===
                "/"
            ) {

                event.respondWith(

                    fetch(
                        event.request,
                        {
                            cache:
                                "no-store"
                        }
                    )

                );

                return;

            }

        }


        /*
         For CSS, JS, images and other
         assets:

         Network first → cache fallback.
        */

        event.respondWith(

            fetch(
                event.request
            )
            .then(
                function(response) {

                    if (
                        response &&
                        response.status === 200
                    ) {

                        const responseClone =
                            response.clone();

                        caches.open(
                            CACHE_NAME
                        )
                        .then(
                            function(cache) {

                                cache.put(
                                    event.request,
                                    responseClone
                                );

                            }
                        );

                    }

                    return response;

                }
            )
            .catch(
                function() {

                    return caches.match(
                        event.request
                    );

                }
            )

        );

    }
);