 // ==========================================
 // DUKAFLOW ROLE GUARD
 // ==========================================

async function getDukaFlowRole() {

    try {

        const {
            data: {
                user
            },
            error: userError
        } =
        await window.supabaseClient
            .auth
            .getUser();


        if (userError || !user) {

            window.location.replace("login.html");

            return null;

        }


        const {
            data: profile,
            error: profileError
        } =
        await window.supabaseClient
            .from("profiles")
            .select("role, full_name, business_id")
            .eq("user_id", user.id)
            .single();


        if (profileError || !profile) {

            console.error(
                "Could not load user profile:",
                profileError
            );

            alert(
                "Unable to load your DukaFlow profile."
            );

            return null;

        }


        // ==========================================
        // SAVE USER INFORMATION
        // ==========================================

        localStorage.setItem(
            "currentRole",
            profile.role
        );

        localStorage.setItem(
            "currentUserName",
            profile.full_name || user.email
        );

        if (profile.business_id) {

            localStorage.setItem(
                "businessId",
                profile.business_id
            );

        }


        // ==========================================
        // SHOW MANAGE USERS FOR ADMINS
        // ==========================================

        if (profile.role === "admin") {

            // Look for an existing Manage Users link
            let manageUsers =
                document.getElementById(
                    "manageUsersLink"
                );


            // If it doesn't exist, create it
            if (!manageUsers) {

                const nav =
                    document.querySelector(
                        ".main-nav"
                    );


                if (nav) {

                    manageUsers =
                        document.createElement(
                            "a"
                        );

                    manageUsers.id =
                        "manageUsersLink";

                    manageUsers.href =
                        "users.html";

                    manageUsers.innerHTML =
                        "👥 Manage Users";

                    nav.appendChild(
                        manageUsers
                    );

                }

            }

        }


        return profile.role;

    }

    catch (error) {

        console.error(
            "Role guard error:",
            error
        );

        return null;

    }

}


// ==========================================
// PROFESSIONAL ADMIN ACCESS POPUP
// ==========================================

function showAdminAccessPopup() {

    const overlay =
        document.createElement(
            "div"
        );

    overlay.style.position =
        "fixed";

    overlay.style.top =
        "0";

    overlay.style.left =
        "0";

    overlay.style.width =
        "100%";

    overlay.style.height =
        "100%";

    overlay.style.background =
        "rgba(0, 0, 0, 0.55)";

    overlay.style.display =
        "flex";

    overlay.style.alignItems =
        "center";

    overlay.style.justifyContent =
        "center";

    overlay.style.zIndex =
        "99999";

    overlay.style.padding =
        "20px";

    const popup =
        document.createElement(
            "div"
        );

    popup.style.background =
        "#ffffff";

    popup.style.width =
        "100%";

    popup.style.maxWidth =
        "420px";

    popup.style.borderRadius =
        "16px";

    popup.style.padding =
        "30px";

    popup.style.textAlign =
        "center";

    popup.style.boxShadow =
        "0 20px 50px rgba(0,0,0,0.25)";

    popup.style.fontFamily =
        "Arial, sans-serif";

    popup.innerHTML = `

        <div style="
            font-size: 42px;
            margin-bottom: 15px;
        ">
            🔒
        </div>

        <h2 style="
            margin: 0 0 10px 0;
            color: #1f2937;
            font-size: 22px;
        ">
            Access Restricted
        </h2>

        <p style="
            margin: 0 0 25px 0;
            color: #6b7280;
            font-size: 15px;
            line-height: 1.6;
        ">
            Reports are available to administrators only.
        </p>

        <button id="adminAccessOkButton" style="
            width: 100%;
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            background: #2563eb;
            color: white;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
        ">
            OK, Continue
        </button>

    `;

    overlay.appendChild(
        popup
    );

    document.body.appendChild(
        overlay
    );


    document
        .getElementById(
            "adminAccessOkButton"
        )
        .addEventListener(
            "click",
            function() {

                window.location.replace(
                    "index.html"
                );

            }
        );

}


// ==========================================
// CHECK ADMIN
// ==========================================

async function requireAdmin() {

    const role =
        await getDukaFlowRole();


    if (!role) {

        return false;

    }


    if (role !== "admin") {

        showAdminAccessPopup();

        return false;

    }


    return true;

}


// ==========================================
// INITIAL ROLE LOAD
// ==========================================

getDukaFlowRole();