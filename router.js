let pageUrls = {  
    about: '/index.html?about',  
    contact: '/index.html?contact',
    gallery: '/index.html?gallery'  
}; 

function OnStartUp() {      
    popStateHandler();  
} 

OnStartUp(); 

document.querySelector('#about-link').addEventListener('click', () => {  
    updatePage('about', RenderAboutPage);  
}); 

document.querySelector('#contact-link').addEventListener('click', () => {  
    updatePage('contact', RenderContactPage);  
});

document.querySelector('#gallery-link').addEventListener('click', () => {  
    updatePage('gallery', RenderGalleryPage);  
});

function updatePage(page, renderFunction) {
    let stateObj = { page };  
    document.title = page.charAt(0).toUpperCase() + page.slice(1);  
    history.pushState(stateObj, page, `?${page}`);  
    renderFunction();  
}

function RenderAboutPage() {  
    document.querySelector('main').innerHTML = 
        `<h1 class="title">About Me</h1>
<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`;
}
function RenderContactPage() {
    document.querySelector('main').innerHTML = `
<h1 class="title">Contact with me</h1>
<form id="contact-form"> 
<label for="name">Name:</label> 
<input type="text" id="name" name="name" required> 
<label for="email">Email:</label> 
<input type="email" id="email" name="email" required> 
<label for="message">Message:</label> 
<textarea id="message" name="message" required></textarea> 

<!-- CAPTCHA -->
<div id="captcha-container">
<label for="captcha">Please enter the text: <span id="captcha-question"></span></label>
<input type="text" id="captcha" name="captcha" required>
</div>

<button type="submit">Send</button> 
</form>

<div id="form-error" style="color: red; display: none;">Please fill out all fields correctly or solve the CAPTCHA.</div>
`;

    function generateCaptcha() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let captchaText = '';
        for (let i = 0; i < 6; i++) {
            const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
            captchaText += randomChar;
        }
        document.getElementById('captcha-question').textContent = captchaText;
        return captchaText;
    }

    let correctAnswer = generateCaptcha();

    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const captcha = document.getElementById('captcha').value.trim();

        if (name && email && message && captcha === correctAnswer) {
            alert('Form submitted successfully!');
            form.reset();
            document.getElementById('form-error').style.display = 'none';
            correctAnswer = generateCaptcha();
        } else {
            document.getElementById('form-error').style.display = 'block';
        }
    });
}

function RenderGalleryPage() {
    document.querySelector('main').innerHTML = 
        `<h1 class="title">Gallery</h1>
<div id="gallery" class="gallery"></div>
<div id="loading" class="loading">Loading...</div>
</div>`;

    const gallery = document.getElementById('gallery');
    const loading = document.getElementById('loading');
    let imageCount = 9;
    let isLoading = false;

    function loadImages() {
        if (isLoading) return;
        isLoading = true;
        loading.style.display = 'block';

        setTimeout(() => {
            for (let i = 0; i < 9; i++) {
                const img = document.createElement('img');
                img.setAttribute('data-src', `https://robohash.org/${imageCount + i}?size=300x300`);

                img.classList.add('lazy');

                gallery.appendChild(img);
            }
            imageCount += 9;
            isLoading = false;
            loading.style.display = 'none';

            lazyLoadImages();
        }, 1000);
    }

    function lazyLoadImages() {
        const lazyImages = document.querySelectorAll('.lazy');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            observer.observe(img);
        });
    }





    loadImages();
}

function popStateHandler() {  
    let loc = window.location.href.toString().split(window.location.host)[1];  
    if (loc === pageUrls.contact) RenderContactPage(); 
    if (loc === pageUrls.about) RenderAboutPage(); 
    if (loc === pageUrls.gallery) RenderGalleryPage(); 
} 

window.onpopstate = popStateHandler;  
document.getElementById('theme-toggle').addEventListener('click', () => { 
    document.body.classList.toggle('dark-mode'); 
});