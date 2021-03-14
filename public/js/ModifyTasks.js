addEventListener("load", function() {
    setActiveNavItem();
    if (JSON.parse(sessionStorage.getItem("authentication_organizaMiDia"))) {
        showUsernameInNav();
    } else {
        location.href = "/";
    }
});
