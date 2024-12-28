document.addEventListener("DOMContentLoaded", function () {
    const contentContainer = document.getElementById("content");

    // Function to load content dynamically
    function loadContent(page) {
        fetch(`${page}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text();
            })
            .then(data => {
                contentContainer.innerHTML = data;
                if (page === "blog") {
                    loadBlogPosts(); // Load blog posts if the blog page is accessed
                }
                attachBlogPostLinks(); // Attach event listeners to blog post links
            })
            .catch(error => console.error("Error loading content:", error));
    }

    // Function to load blog posts
    function loadBlogPosts() {
        const blogPostsContainer = document.querySelector(".blog-posts");
        if (!blogPostsContainer) return;
    
        // List of Markdown files
        const posts = ["blog-post-1.md"];
    
        posts.forEach(post => {
            fetch(`blog-posts/${post}`)
                .then(response => response.text())
                .then(text => {
                    // Extract the first line as the heading and the second line as the subheading
                    const lines = text.split("\n");
                    const heading = lines[0].replace("#", "").trim();
                    const subheading = lines[1].replace("###", "").trim();
    
                    // Render the blog post preview
                    const postElement = document.createElement("div");
                    postElement.className = "post";
                    postElement.innerHTML = `
                        <h3><a href="#" data-post="blog-posts/${post}">${heading}</a></h3>
                        <p class="subheading">${subheading}</p>
                        <hr class="solid">
                    `;
                    blogPostsContainer.appendChild(postElement);
                })
                .catch(error => console.error("Error loading blog post:", error));
        });
    }

    // Function to load individual blog post
    function loadBlogPost(post) {
        fetch(post)
            .then(response => response.text())
            .then(text => {
                const html = marked.parse(text);
                contentContainer.innerHTML = `
                    <div class="blog-post">
                        <div class="content">${html}</div>
                    </div>
                `;
            })
            .catch(error => console.error("Error loading blog post:", error));
    }

    // Attach event listeners to navigation links
    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const page = this.getAttribute("data-page");
            loadContent(page);
        });
    });

    // Attach event listeners to blog post links
    function attachBlogPostLinks() {
        const blogPostLinks = document.querySelectorAll(".blog-posts .post a");
        blogPostLinks.forEach(link => {
            link.addEventListener("click", function (event) {
                event.preventDefault();
                const post = this.getAttribute("data-post");
                loadBlogPost(post);
            });
        });
    }

    // Load default content (home page) on initial load
    loadContent("home");

    // Attach blog post links after content is loaded
    document.addEventListener("click", attachBlogPostLinks);
});