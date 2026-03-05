import './style.css'

// Dynamic Year in Footer
document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('year')
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString()
  }
})

// Navbar and Arrow scroll effects
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY

  // Navbar Logic
  const navbar = document.querySelector('.navbar')
  if (navbar) {
    if (currentScroll > 50) {
      navbar.classList.add('scrolled')
    } else {
      navbar.classList.add('scrolled')
      if (currentScroll <= 5) {
        navbar.classList.remove('scrolled')
      }
    }
  }

  // Scroll Arrow Rotation Logic
  // Calculate how far down the page we are as a percentage
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  const scrollPercent = currentScroll / scrollHeight
  
  // Map that percentage to degrees (e.g. 0 to 180 degrees)
  const rotationDegrees = scrollPercent * 180

  const arrows = document.querySelectorAll('.scroll-arrow')
  arrows.forEach(arrow => {
    const el = arrow as HTMLElement
    el.style.transform = `rotate(${rotationDegrees}deg)`
    el.style.transition = 'transform 0.1s ease-out'
  })
})

// Elements Reveal on scroll (Smooth enter animation for marked elements)
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -50px 0px',
  threshold: 0.1
}

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

document.querySelectorAll('.fade-item').forEach(item => {
  observer.observe(item)
})

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle')
const sunIcon = document.querySelector('.sun-icon') as HTMLElement
const moonIcon = document.querySelector('.moon-icon') as HTMLElement

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode')

    if (document.body.classList.contains('light-mode')) {
      sunIcon.style.display = 'none'
      moonIcon.style.display = 'block'
    } else {
      sunIcon.style.display = 'block'
      moonIcon.style.display = 'none'
    }
  })
}

// Interactive Mouse Move for the Background Orbs
document.addEventListener('mousemove', (e) => {
  const interactiveBg = document.getElementById('interactive-bg')
  if (interactiveBg) {
    const x = e.clientX / window.innerWidth
    const y = e.clientY / window.innerHeight
    interactiveBg.style.transform = `translate(${x * -30}px, ${y * -30}px)`
  }
})

// Number Animation for Metrics
const metricsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateNumbers(entry.target as HTMLElement)
      observer.unobserve(entry.target)
    }
  })
}, { threshold: 0.5 })

document.querySelectorAll('.metric-number').forEach(el => {
  metricsObserver.observe(el)
})

function animateNumbers(element: HTMLElement) {
  const target = parseInt(element.getAttribute('data-target') || '0', 10)
  const duration = 2000 // 2 seconds
  const stepTime = Math.abs(Math.floor(duration / 100))
  let current = 0
  const increment = target / 100

  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      clearInterval(timer)
      current = target
    }

    // Format number with commas
    element.textContent = Math.floor(current).toLocaleString()
  }, stepTime)
}
