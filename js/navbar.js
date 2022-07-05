const navbarTemplate = document.createElement("template");

navbarTemplate.innerHTML = `
  <link rel="stylesheet" href="../css/materialize.min.css">
  <link rel="stylesheet" href="../css/style.css">

  <style>  
    .closeSideNav {
      position: absolute;
      left: 100%;
      width: 30px;
      height: 30px;
      transform: translateX(-100%);
      cursor: pointer;
      background: transparent;
      outline: none;
      border: none;
      font-size: 14px;
      font-weight: bold;
      top: 5px;
    }
  </style>

  <nav class="z-depth-0">
    <div class="nav-wrapper container">
      <a href="/">Food<span>Ninja</span></a>
      <span class="right grey-text text-darken-1">
        <i class="material-icons sidenav-trigger" data-target="side-menu">🍔</i>
      </span>
    </div>
  </nav>

  <ul id="side-menu" class="sidenav side-menu">
    <button class="closeSideNav">X</button>
    <li><a class="subheader">FOODNINJA</a></li>
    <li><a href="/" class="waves-effect">Home</a></li>
    <li><a href="/pages/about.html" class="waves-effect">About</a></li>
    <li><div class="divider"></div></li>
    <li><a href="/pages/contact.html" class="waves-effect">
      <i class="material-icons">mail_outline</i>Contact</a>
    </li>
  </ul>
`;


class Navbar extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:"open"});
    this.shadowRoot.appendChild(navbarTemplate.content.cloneNode(true));
    this.isSideNavOpen = false;
  }


  connectedCallback(){
    this.shadowRoot.querySelector(".sidenav-trigger").addEventListener("click", e => {
      let sideNav = e.target.parentElement.parentElement.parentElement.nextElementSibling;
      if(!this.isSideNavOpen){
        sideNav.style.left = "100%"
        sideNav.style.transform = "transformX(-150%)"
        this.isSideNavOpen = true
      }
    })
    this.shadowRoot.querySelector(".closeSideNav").addEventListener("click", e => {
      let sideNav = e.target.parentElement;
      if(this.isSideNavOpen){
        sideNav.style.left = "0"
        this.isSideNavOpen = false
      }
    })
  }
  
  disconnectedCallback(){
    this.shadowRoot.querySelector("sidenav-trigger").removeEventListener()
    this.shadowRoot.querySelector(".closeSideNav").removeEventListener()
  }


}

window.customElements.define("nav-bar", Navbar);