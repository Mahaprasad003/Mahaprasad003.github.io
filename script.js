// script.js
document.addEventListener("DOMContentLoaded", function () {
    function loadContent(page) {
        fetch(page + '.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('content').innerHTML = data;
                attachBlogPostLinks(); // Re-attach event listeners for blog post links
            })
            .catch(error => console.error('Error loading content:', error));
    }

    function attachBlogPostLinks() {
        const blogPostLinks = document.querySelectorAll('.blog-posts .post a');
        blogPostLinks.forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                const post = this.getAttribute('data-post');
                loadContent(post);
            });
        });
    }

    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const page = this.getAttribute('data-page');
            loadContent(page);
        });
    });

    // Load home content by default
    loadContent('home');
});
