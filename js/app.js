/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

/**
 * Define Global Variables
 *
 */
const navbar = document.querySelector('#navbar')
const navbarList = document.querySelector('#navbar__list')
const sections = document.querySelectorAll('section')
const toTopButton = document.querySelector('#to_top_button')
const FIXED_NAVBAR_CLASS = 'fxed-navbar'
const ACTIVE_CLASS = 'your-active-class'
const COLLAPSED_CLASS = 'collapsed'

let navTimer = setTimeout(() => {}, 0)
/**
 * End Global Variables
 * Start Helper Functions
 *
 */
function addHTMLLinksForSections(sectionList) {
    let insertHtml = ''
    for (const section of sectionList) {
        insertHtml += `<li>
                <a class="menu__link" data-nav="${section.getAttribute(
                    'data-nav'
                )}">
                    ${section.querySelector('h2').textContent}
                </a>
            </li>
            `
    }
    return insertHtml
}

// adds and remove padding to the first section that there is not jumping when scrolling
function paddingToSection1(add) {
    if (add)
        sections[0].style.paddingTop =
            navbar.getBoundingClientRect().height + 'px'
    else sections[0].style.paddingTop = 0
}

function getElementByTagAndDataNav(tag, target) {
    return document.querySelector(
        `${tag}[data-nav="${target.getAttribute('data-nav')}"]`
    )
}

//applies and reset the Timeout for the slide out and and slide in of the navbar
function applyTimer() {
    if (navbar.classList.contains('slide-out')) {
        navbar.classList.remove('slide-out')
        navbar.classList.add('slide-in')
    } else {
        clearTimeout(navTimer)
    }
    navTimer = setTimeout(() => {
        navbar.classList.add('slide-out')
        navbar.classList.remove('slide-in')
    }, 1000)
}

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// after scrolling reaches the navbar, it will be fixed to the top
function fixNavbarToTop() {
    if (navbar.getBoundingClientRect().top < 0) {
        navbar.classList.add(FIXED_NAVBAR_CLASS)
        paddingToSection1(true)
        document.addEventListener('scroll', unfixNavbarToTop)
        document.removeEventListener('scroll', fixNavbarToTop)
        navbar.classList.remove('slide-in')
        toTopButton.classList.add('visible')
    }
}

// aftre scrolling reaches the postion where the navbar was, it will set ther back
function unfixNavbarToTop() {
    if (sections[0].getBoundingClientRect().top > 0) {
        navbar.classList.remove(FIXED_NAVBAR_CLASS)
        paddingToSection1(false)
        document.addEventListener('scroll', fixNavbarToTop)
        document.removeEventListener('scroll', unfixNavbarToTop)
        navbar.classList.remove('slide-in')
        clearTimeout(navTimer)
        toTopButton.classList.remove('visible')
    } else {
        changeActiveSection(sections)
        applyTimer()
    }
}

// Add class 'active' to section when near top of viewport
function changeActiveSection(sectionList) {
    for (const section of sectionList) {
        const top = section.getBoundingClientRect().top
        const bottom = section.getBoundingClientRect().bottom
        if (bottom + 60 > 0 && top - 150 < 0) {
            //near top of viewport
            for (const otherSection of sectionList) {
                otherSection.classList.remove(ACTIVE_CLASS)
                getElementByTagAndDataNav('a', otherSection).classList.remove(
                    ACTIVE_CLASS
                )
            }
            section.classList.add(ACTIVE_CLASS)
            getElementByTagAndDataNav('a', section).classList.add(ACTIVE_CLASS)
        }
    }
}

// toggle section collapsible
function toggleSectionCollapsible(section) {
    const sectionTitleCaret = section.querySelector('h2 i')
    if (section.classList.contains(COLLAPSED_CLASS)) {
        section.classList.remove(COLLAPSED_CLASS)
        sectionTitleCaret.classList.remove('fa-caret-up')
        sectionTitleCaret.classList.add('fa-caret-down')
    } else {
        section.classList.add(COLLAPSED_CLASS)
        sectionTitleCaret.classList.remove('fa-caret-down')
        sectionTitleCaret.classList.add('fa-caret-up')
    }
}

// add carets to headers
function addCarets() {
    for (const section of sections) {
        const sectionTitle = section.querySelector('h2')
        sectionTitle.insertAdjacentHTML(
            'beforeend',
            '<i class="fa fa-caret-down" aria-hidden="true"></i>'
        )
        sectionTitle.addEventListener('click', () =>
            toggleSectionCollapsible(section)
        )
    }
}

// build the nav

navbarList.insertAdjacentHTML('beforeend', addHTMLLinksForSections(sections))

// Scroll to anchor ID using scrollTO event

/**
 * End Main Functions
 * Begin Events
 *
 */
document.addEventListener('scroll', fixNavbarToTop)
toTopButton.addEventListener('click', () =>
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    })
)

// Build menu

navbarList.addEventListener('click', (event) => {
    const target = event.target
    if (target.tagName === 'A')
        getElementByTagAndDataNav('section', target).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
})

// Scroll to section on link click

// Set sections as active
changeActiveSection(sections)

//add carets to section headers and add the collapsible
addCarets()
