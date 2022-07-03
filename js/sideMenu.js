const sideMenuTemplate = document.createElement("template");

sideMenuTemplate.innerHTML = `
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
  <link rel="stylesheet" href="./css/style.css">

  <ul id="side-menu" class="sidenav side-menu">
    <li><a class="subheader">FOODNINJA</a></li>
    <li><a href="/" class="waves-effect">Home</a></li>
    <li><a href="/pages/about.html" class="waves-effect">About</a></li>
    <li><div class="divider"></div></li>
    <li><a href="/pages/contact.html" class="waves-effect">
      <i class="material-icons">mail_outline</i>Contact</a>
    </li>
  </ul>

`;


class SideMenu extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:"open"});
    this.shadowRoot.appendChild(sideMenuTemplate.content.cloneNode(true));
  }


  connectedCallback(){

  }
  
  disconnectedCallback(){
  }


}

window.customElements.define("side-menu", SideMenu);