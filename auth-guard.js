const SUPABASE_URL =
    "https://uwfghbctckinymatcbro.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_Qj4YqDW3lU2ouxevXa0upg_zbxzJG-X";


window.supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==========================================
// CHECK REAL SUPABASE SESSION
// ==========================================

window.authReady = checkAuthentication();


async function checkAuthentication() {

    const {
        data: {
            session
        },
        error
    } =
        await window.supabaseClient.auth.getSession();


    // NO VALID SESSION

    if (error || !session) {

        localStorage.removeItem("loggedIn");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("currentRole");
        localStorage.removeItem("userId");

        window.location.replace(
            "login.html"
        );

        return false;
    }


    // VALID SESSION

    console.log(
        "Authenticated user:",
        session.user.id
    );


    // UPDATE LOCAL INFORMATION

    localStorage.setItem(
        "loggedIn",
        "true"
    );

    localStorage.setItem(
        "currentUser",
        session.user.email
    );

    localStorage.setItem(
        "userId",
        session.user.id
    );


    // ==========================================
    // CHECK SUBSCRIPTION FOR PROTECTED PAGES
    // ==========================================

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    /*
       Dashboard remains accessible even when
       subscription is expired so the user can
       see the payment section and renew.

       All other protected pages require an
       active subscription.
    */

    const subscriptionProtectedPages = [
        "products.html",
        "sales.html",
        "expenses.html",
        "reports.html",
        "users.html"
    ];


    if (
        subscriptionProtectedPages.includes(
            currentPage
        )
    ) {

        const {
            data: subscriptionActive,
            error: subscriptionError
        } =
        await window.supabaseClient
            .rpc(
                "has_active_subscription"
            );


        // ==========================================
        // SUBSCRIPTION CHECK FAILED
        // ==========================================

        if (subscriptionError) {

            console.error(
                "Subscription check error:",
                subscriptionError
            );


            /*
               Fail closed.

               If we cannot verify the subscription,
               do not allow access to protected pages.
            */

            window.location.replace(
                "index.html"
            );

            return false;

        }


        // ==========================================
        // SUBSCRIPTION EXPIRED / INACTIVE
        // ==========================================

        if (
            subscriptionActive !== true
        ) {

            console.log(
                "Subscription inactive. Access blocked:",
                currentPage
            );


            window.location.replace(
                "index.html"
            );

            return false;

        }

    }


    // ==========================================
    // AUTHENTICATION + SUBSCRIPTION PASSED
    // ==========================================

    return true;
}