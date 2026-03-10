const auth = document.getElementById('auth')
const tabs = document.querySelectorAll('.auth__tab')

const login_form = document.getElementById('login_form')
const registration_form = document.getElementById('registration_form')

const switch_tab = function (tab_name) {
    tabs.forEach(tab => {
        tab.classList.remove('auth__tab--active')
    })

    const active_tab = document.querySelector(`[data-tab=${tab_name}]`)

    if (active_tab) {
        active_tab.classList.add('auth__tab--active')
    }

    if (tab_name == 'login') {
        login_form.hidden = false
        registration_form.hidden = true
    } else {
        login_form.hidden = true
        registration_form.hidden = false
    }
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        switch_tab(tab.dataset.tab)
    })
})

const open_auth_window = function () {
    auth.classList.add('auth--open')
    switch_tab('login')
}

const close_auth_window = function () {
    auth.classList.remove('auth--open')
}

auth.addEventListener('click', e => {
    if (e.target == auth) {
        close_auth_window()
    }
})

window.open_auth_window = open_auth_window
window.close_auth_window = close_auth_window