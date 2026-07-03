/*
SVG compliance logos v1
Initial release: march 2020
Dependencies: site's local speedbump function 
To use: 
- Remove references to firstBranchLogo (setupFBlogo & the on click function for #bv-logo)
- Copy these 4 lines into DOM Ready:
    complianceLogos.allColors = "#989898";
    complianceLogos.buildAll();
    confirmAlert('.compliance a.confirm', alertText); // or whatever the speedbump call for this site is
    confirmAlert('.compliance a.warn', warnText); // or whatever the speedbump call for this site is

- Script builds off the default IDs (#eh, #fdic, #ncua, #bv-logo) and will not throw an error if an ID is missing

*/


window.addEventListener('DOMContentLoaded', () => {

    // define variables to call in Source Sans google font
    var googleapislink = document.createElement('link');
    googleapislink.setAttribute('rel', 'preconnect');
    googleapislink.setAttribute('href', 'https://fonts.googleapis.com');
    document.head.appendChild(googleapislink);

    var gstaticlink = document.createElement('link');
    gstaticlink.setAttribute('rel', 'preconnect');
    gstaticlink.setAttribute('crossorigin', '');
    gstaticlink.setAttribute('href', 'https://fonts.gstatic.com');
    document.head.appendChild(gstaticlink);

    var sourcesanslink = document.createElement('link');
    sourcesanslink.setAttribute('rel', 'stylesheet');
    sourcesanslink.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Source+Sans+3:ital@0;1&display=swap');
    document.head.appendChild(sourcesanslink);


    if (document.getElementById('fdic')) {
        complianceLogos.fdicBandInclude = true;
    } else {
        complianceLogos.fdicBandInclude = false;
    }
});


var complianceLogos = {
    allColors: '',
    fdicColor: '',
    fdicTarget: 'fdic',
    fdicLink: 'https://www.fdic.gov',
    fdicLinkClass: 'warn',
    fdicBandTarget: 'fdicBand',
    fdicBandInclude: false,
    fdicBandTheme: 'light',
    fdicBandBg: '#fff',
    fdicBandAlign: 'center',
    /* default is center, other option is left*/
    ehColor: '',
    ehTarget: 'eh',
    ehLink: '',
    ehLinkClass: '',
    ehOpportunity: false,
    ncuaTarget: 'ncua',
    ncuaColorText: '',
    ncuaColorFill: 'transparent',
    ncuaLink: '/ncua-federal-insurance.html',
    ncuaLinkClass: '',
    ncuaUseText: false,
    ncuaHover: false,
    ncuaHoverTarget: 'ncuaHover',
    ncuaHoverColorText: '#000',
    ncuaHoverColorFill: '#fff',
    firstbranchTarget: 'bv-logo',
    firstbranchColor: '',
    /* red: #d41a27 */
    firstbranchColor2: '',
    /* gray: #666 */
    firstbranchLink: 'https://www.thisisfirstbranch.com',
    firstbranchLinkClass: 'confirm',

    buildFdic: function(color) {
        var color = this.fdicColor !== '' ? this.fdicColor : this.allColors;
        var fdicSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="680.1" height="417.551" viewBox="0 0 680.1 417.551" role="img" aria-label="Member FDIC"><g id="memberfdic" data-name="memberfdic" transform="translate(-9.9 559)" fill="' + color + '"><path id="Path_1" data-name="Path 1" d="M10-552.5v6.5h4.4c6.1,0,10.6,1.8,11.7,4.7,1.2,3.2,1.2,73.4,0,76.6-1.1,2.9-2.9,3.7-10.1,4.6l-5.5.6-.3,6.2L9.9-447H62v-12.7l-6.1-.6c-4.7-.4-6.8-1.1-8.6-2.9L45-465.6l.2-33.1.3-33.2,9.7,27.7c5.3,15.2,12,34.4,14.9,42.5l5.1,14.8,6.7-.3,6.6-.3,16-42.5,16-42.4.3,33.9c.3,39.8,1,37.2-10.6,38.2l-7.2.6V-447h60v-12.8l-7.1-.4c-11.7-.6-11,1.9-10.7-42.5l.3-37.5,2.7-2.3c1.8-1.6,4.6-2.5,8.7-3l6.1-.7V-559l-25.7.2-25.7.3L99-524.3C92.1-505.4,86.2-490,85.8-490c-.3,0-2.3-5.1-4.4-11.3-2-6.1-7.3-21.7-11.7-34.5L61.8-559H10Z" /><path id="Path_2" data-name="Path 2" d="M418-553v6h4a8.037,8.037,0,0,1,6.5,2.5l2.5,2.4V-446h5.3c5-.1,5.3-.2,8.6-4.6l3.3-4.6,3.2,3.1c5.5,5.3,12,7.6,21.6,7.6,10.2-.1,16.2-2.4,22.8-8.8,16.2-15.6,16.2-50.7.1-66.8a26.338,26.338,0,0,0-19.9-8.2c-7.9-.1-12.2,1.3-18.6,5.8l-4.9,3.5-.5-19.7-.5-19.8-16.7-.3L418-559Zm59.4,42c5.5,4.9,7.1,10.5,7.1,24.5,0,10.4-.3,12.7-2.3,17-3,6.6-5.7,9.3-10.5,10.6a14.148,14.148,0,0,1-15.2-6c-4.9-7.3-6.7-20.5-4.5-32.2,2.2-11.6,7.4-16.9,16.6-16.9C473.1-514,474.5-513.5,477.4-511Z" /><path id="Path_3" data-name="Path 3" d="M204.2-527.9c-16.4,2.8-28.5,16.4-31.3,35-2.9,19.9,5.4,37,21.9,44.7,5.2,2.5,6.8,2.7,17.7,2.7,11.1,0,12.4-.2,17.7-2.8a34.512,34.512,0,0,0,8.9-6.4c3.7-4.2,7.4-12.1,8.4-17.6l.7-3.7h-14l-1.2,3.7c-3.1,9.4-9.4,13.8-19.1,13.1-10.7-.8-17.7-8.4-18.7-20.5l-.4-5.3H248v-3.3c0-5.2-2.7-16.2-5-20.7C235.8-523.1,220.3-530.7,204.2-527.9Zm15.3,14.3c3.3,2.2,5.4,6.4,5.7,11.7l.3,4.4-14.3.3c-16.1.3-16.1.3-14.2-6.9,2.1-7.8,8.1-12.2,15.7-11.5A17.627,17.627,0,0,1,219.5-513.6Z" /><path id="Path_4" data-name="Path 4" d="M315-528.1c-4.8,1.5-9.3,4.3-14.2,8.8l-4.8,4.6V-527H260v11.8l6,.4c9.8.7,9.5,0,9.5,27.4,0,23.6,0,23.6-2.4,25.5-1.6,1.3-3.9,1.9-7.7,1.9H260v13l23.8-.2,23.7-.3v-12l-3.8-.6c-7-1.1-7.2-1.8-7.2-21.7,0-17.1.1-17.9,2.6-22.7,3.4-6.7,7.7-9.5,14.5-9.5,4.5,0,5.9.5,8.6,2.9l3.3,2.9.3,21.9c.3,24.9.2,25.3-6.9,26.2l-4.4.6-.3,6.2-.3,6.3H357v-13h-3.3c-6.7,0-7.2-1.1-7.5-17.4-.4-16.6.7-23.5,4.6-29.5,6.3-9.7,21-10.9,24.1-2,.7,2,1.1,11.6,1.1,25,0,24.4.2,23.9-7.4,23.9H365v13h47v-13h-6.4c-3.9,0-6.8-.5-7.4-1.3-.6-.7-1.2-11.1-1.4-25.7-.6-30.7-1.6-34.3-11.3-39.3-3-1.5-5.9-2-11.5-2.1-9,0-16.4,3-23.2,9.2l-4.4,4-4.7-5.3c-3.3-3.8-6-5.8-9.3-6.9C327.5-529.1,319.3-529.4,315-528.1Z" /><path id="Path_5" data-name="Path 5" d="M554.2-527.9c-14.2,2.4-25.6,13.3-29.7,28.3-2.7,9.9-1.8,25.1,1.9,33.3a38.517,38.517,0,0,0,18.4,18.1c5.2,2.5,6.8,2.7,17.7,2.7,11.1,0,12.4-.2,17.7-2.8,8.7-4.3,15.9-14,17.4-23.6l.7-4.1h-7.2c-6,0-7.2.3-7.7,1.7-1.3,4.5-5.2,10.8-7.7,12.7-4.3,3.2-14,3.4-19.6.4-5.9-3.1-10.3-10.7-10.5-18.1l-.1-5.2,26.3-.3L598-485v-4.3a49.541,49.541,0,0,0-1.5-10c-4.2-16.1-14-25.9-29-28.6C561-529.1,561.6-529.1,554.2-527.9ZM568-514.2c4.3,2.1,7.1,6.8,7.3,12.4l.2,4.3h-29l.2-4.3C547.2-512.8,558.1-519.2,568-514.2Z" /><path id="Path_6" data-name="Path 6" d="M663.5-528.1c-4.5,1.1-7.5,3-12.5,7.5l-4.5,4.1-.3-5.3-.3-5.2-17.7.2-17.7.3-.3,5.6-.3,5.7,6.2.4c10,.7,9.9.5,9.9,27.7,0,17.7-.3,23.1-1.4,24.6-1,1.4-3,2-8,2.3l-6.6.4V-447h52v-13h-5.7c-3.2,0-6.4-.4-7.1-.8-2.1-1.4-3.2-7.3-3.2-17.7.1-26.8,5.6-38.2,18.8-39.3l5.5-.5-3.6,3.7c-3.2,3.1-3.7,4.3-3.7,8.2,0,3.7.6,5.1,2.9,7.5,4,4,11.5,4.2,16,.4,5.5-4.7,6.6-14.8,2.2-21.9C680.4-526.3,670.6-529.9,663.5-528.1Z" /><path id="Path_7" data-name="Path 7" d="M619-411.3c-43.2,4.4-78.4,23.5-102.1,55.5-7.5,10.1-17,29.3-20.4,41.3a136.656,136.656,0,0,0,8.5,99.2c18.4,37.3,51.3,62.1,95,71.4,14.1,3,43.1,3.3,56,.6,10.9-2.4,22.1-6.7,28.8-11.2l5.2-3.6v-34.4c0-22.8-.3-34.5-1-34.5-.6,0-2.7,1.1-4.8,2.4A125.382,125.382,0,0,1,658-212.5c-11.3,3.6-30,4.6-41.2,2.1-19.4-4.3-36.6-17.5-45.3-34.6-7.2-14.2-9.5-35.4-5.6-51,5.8-23.7,22-41.9,43.7-49.5,11.3-4,30.3-4.7,42.5-1.6,8.3,2.1,23,8.6,32.2,14.2a37.453,37.453,0,0,0,5.2,2.9c.3,0,.5-15.7.5-34.9v-34.9l-8.2-3C661.9-409.9,637.6-413.2,619-411.3Z" /><path id="Path_8" data-name="Path 8" d="M12.8-275.8c-.2,72.2-.1,131.9.1,132.6.2.9,8.3,1.2,36,1.2H84.7l.6-23.3c.4-12.7.7-35.5.7-50.4V-243l35.3-.2,35.2-.3v-61l-35.3-.3L86-305l.2-20.3.3-20.2,37.5-.2,37.5-.2.3-30.6L162-407H13Z" /><path id="Path_9" data-name="Path 9" d="M172-274.5v132.7l49.3-.5c51.4-.5,61.5-1.3,80.7-5.8,41.2-9.6,70.1-30.2,85.5-60.9,9.1-18.1,13.2-35.3,14.2-58.5,1-25.6-3.3-49.7-12.5-68.9-6.5-13.6-11.8-21.2-22.1-31.9-17.7-18.4-41.3-30.4-70.3-35.8-10.5-2-15.4-2.2-68-2.6l-56.8-.5Zm109-69c23.2,6.1,39.5,22.3,45.7,45.5,2.5,9.2,2.5,35.8-.1,45-8.4,30.5-31.4,46.3-72.3,49.5l-8.3.7V-346.3l14.3.6C268.8-345.4,277.1-344.5,281-343.5Z" /><path id="Path_10" data-name="Path 10" d="M410-274.5V-142h72V-407H410Z" /></g></svg>';
        buildSvg(fdicSvg, this.fdicTarget, this.fdicLink, this.fdicLinkClass);
    },

    buildFdicBand: function(color) {
        if (this.fdicBandInclude == true) {
            var body = document.body;
            if (!body.classList.contains('popup') || body.classList.contains('with-fdic-band')) {
                var color = this.fdicBandTheme !== 'dark' ? '#003256' : '#fff';
                var bgColor = this.fdicBandTheme !== 'dark' ? '#fff' : this.fdicBandBg;
                var fontColor = this.fdicBandTheme !== 'dark' ? '#000' : '#fff';
                var fdicAlign = this.fdicBandAlign !== 'left' ? 'center' : this.fdicBandAlign;
                var fdicContFluid = this.fdicContFluid !== 'true' ? 'false' : this.fdicContFluid;
                var fdicBeforeStyle = '#fdicBand:before{content:"";position:absolute;display:block;width:100vw;height:100%;z-index:-1;left:50%;transform:translateX(-50%);background:' + bgColor + ';}@media screen and (min-width:768px){#fdicBand{justify-content:start !important;}}';
                var fdicBandSvg = '<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="38" height="16" viewBox="0 0 76 30.35" role="img" aria-labelledby="fdicBandTitle"><title id="fdicBandTitle">Member FDIC</title><defs><style>.fdic-svg{fill:' + color + ';fill-rule:evenodd;stroke-width:0px;}</style></defs><path class="fdic-svg" d="M17.88.55h10.42c9.4,0,15.39,5.78,15.39,14.8,0,9.99-6.64,14.85-17.23,14.85h-8.59V.55h0ZM27.66,7.35c-.38,0-.86.05-1.51.05v15.99c5.29,0,9.4-2.11,9.4-8.21,0-5.24-3.35-7.83-7.89-7.83h0Z"/><path class="fdic-svg" d="M76,9.18V1.35c-2.11-.86-4-1.35-6.64-1.35-8.7,0-15.66,6.59-15.66,15.29s6.86,15.07,15.5,15.07c3.08,0,5.19-.65,6.81-1.89v-7.83c-2.43,1.51-4.1,2.16-6.37,2.16-4.37,0-7.78-3.19-7.78-7.89s3.46-7.94,7.78-7.94c2.38,0,4.11.81,6.37,2.21h0Z"/><polygon class="fdic-svg" points="0 .55 0 30.2 8.16 30.2 8.21 18.86 16.15 18.86 16.15 12 8.26 12 8.21 7.41 16.74 7.41 16.74 .55 0 .55 0 .55"/><polygon class="fdic-svg" points="44.57 30.2 52.72 30.2 52.72 .55 44.57 .55 44.57 30.2 44.57 30.2"/></svg>';
                var fdicBand = document.createElement('div');
                fdicBand.setAttribute('id', 'fdicBand');
                fdicBand.setAttribute('role', 'banner');
                fdicBand.setAttribute('style', 'position:relative;z-index:999;display:flex;gap:10px;align-items:center;justify-content:center;padding:10px;background-color:' + bgColor + ';');
                if (fdicAlign === 'left') {
                    fdicBand.setAttribute('data-align', fdicAlign);
                    if (fdicContFluid === 'true') {
                        fdicBand.classList.add('container-fluid');
                    } else {
                        fdicBand.classList.add('container');
                    }
                    var fdicBeforeStyleTag = document.createElement('style');
                    fdicBeforeStyleTag.prepend(fdicBeforeStyle);
                    body.prepend(fdicBeforeStyleTag);
                }
                body.prepend(fdicBand);
                buildSvg(fdicBandSvg, this.fdicBandTarget);
                var fdicText = document.createElement('span');
                fdicText.prepend('FDIC-Insured - Backed by the full faith and credit of the U.S. Government');
                if (window.matchMedia('(min-width: 600px)').matches) {
                    fdicText.setAttribute('style', 'font-family:"Source Sans Pro", "Source Sans 3", sans-serif;font-weight:400;font-style:italic;font-size:14px;line-height:1;color:' + fontColor + ';');
                } else {
                    fdicText.setAttribute('style', 'font-family:"Source Sans Pro", "Source Sans 3", sans-serif;font-weight:400;font-style:italic;font-size:14px;line-height:1;color:' + fontColor + ';flex:0 1 60%;');
                }
                fdicBand.append(fdicText);
            }
        }
    },

    buildEh: function(color) {
        var color = this.ehColor !== '' ? this.ehColor : this.allColors;
        var ehSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 106.328 107.998" role="img" aria-labelledby="ehTitle"><title id="ehTitle">Equal Housing Lender</title><path fill="' + color + '" d="M0 30.252L53.763 0l52.565 30.552v10.633h-8.387v37.591H8.237v-37.59H0V30.252zm53.759-18.855L19.165 31.466v37.741h68.439V31.466L53.759 11.397zM35.36 45.844v-9.286h35.792v9.286H35.36zm0 4.63h35.792v9.286H35.36v-9.286zM54.809 107.998V96.167h6.29c4.493 0 7.638 1.348 7.638 6.141 0 4.643-2.845 5.691-7.788 5.691h-6.14zm3.293-9.29v6.739h2.696c2.545 0 4.343-.449 4.343-3.145 0-2.396-1.947-3.594-4.043-3.594h-2.996zM87.47 107.998V96.167h8.686c3.294 0 4.643 1.049 4.643 3.744 0 1.947-1.049 2.846-3.295 3.146l3.444 4.942h-3.594l-3.444-4.942h-3.145v4.942H87.47zm8.222-9.288H90.75v1.797h4.792c1.647 0 2.097 0 2.097-.899 0-.748-.599-.898-1.947-.898zM36.845 96.167v11.831h3.145v-7.188l6.29 7.188h3.744V96.167h-3.145v7.338l-6.29-7.338zM6.127 96.167v11.831h11.831v-2.546l-8.536-.15v-9.135zM21.271 107.998h11.531v-2.546h-8.087v-2.546h6.739v-2.396h-6.739v-1.797h8.087v-2.546H21.271zM72.341 96.167v11.831l11.381-.149v-2.397h-8.087v-2.546h6.889v-2.396h-6.889v-1.797h8.087v-2.546zM29.49 93.165l2.995-10.633h2.546l2.995 10.633h-2.333l-.663-2.396h-2.696l-.663 2.396H29.49zm4.205-8.364l-.898 4.193h1.947l-1.049-4.193zM12.875 89.272v-2.846c0-2.696.898-4.193 3.594-4.193 2.995 0 3.594 1.797 3.594 4.343v2.247c0 1.348-.15 1.947-.599 2.846l1.797.599-.15.749c-6.139 0-8.236-.15-8.236-3.745zm2.241-2.697v2.546c0 1.947.3 2.546 1.348 2.546 1.198 0 1.348-.449 1.348-2.396v-2.846c0-2.097-.149-2.396-1.198-2.396-1.348-.001-1.498.599-1.498 2.546zM73.677 90.318c0 1.647 1.048 2.996 3.444 2.996 1.947 0 3.744-1.348 3.744-2.996 0-2.546-4.792-3.744-4.792-5.392 0-.599.599-.898 1.198-.898.898 0 1.348.599 1.797 1.498l1.498-.599c-.149-1.498-1.198-2.696-3.444-2.696-1.797 0-3.294.898-3.294 2.696 0 2.996 4.792 3.744 4.792 5.691 0 .749-.449 1.049-1.348 1.049s-1.498-.599-1.797-1.647l-1.798.298zM57.521 89.719v-3.444c0-2.846 1.348-4.044 3.594-4.044 2.846 0 3.594 1.048 3.594 3.744v3.295c0 2.846-.749 4.044-3.594 4.044-2.844-.001-3.594-1.049-3.594-3.595zm2.241-3.594v3.294c0 1.498.149 2.247 1.348 2.247.898 0 1.348-.599 1.348-2.396v-3.145c0-1.198-.149-2.247-1.348-2.247s-1.348.899-1.348 2.247zM93.597 89.27c0 3.145.899 4.044 3.894 4.044 2.318 0 2.995-1.087 2.995-2.247v-3.445h-3.145v1.647h1.048v1.198c0 .898-.299 1.348-1.048 1.348-1.498 0-1.647-1.049-1.647-2.546v-2.396c0-1.797.149-2.995 1.647-2.995 1.048 0 1.647.749 1.797 1.797l1.497-.599c-.149-1.797-1.348-2.846-3.444-2.846-2.995 0-3.594 1.647-3.594 3.894v3.146zM65.606 82.53v6.14c0 3.595.616 4.744 3.761 4.744 2.396 0 3.277-1.299 3.277-4.444v-6.44h-2.097v6.14c0 2.396-.15 2.996-1.348 2.996-1.198 0-1.348-.899-1.348-3.145V82.53h-2.245zM85.513 82.532v10.633h1.797v-7.189l2.546 7.189h2.696V82.532h-1.798v6.589l-2.396-6.589zM22.174 82.53v6.44c0 2.995.3 4.343 3.295 4.343 3.444 0 3.594-1.647 3.594-4.643v-6.14h-2.097v6.29c0 2.097-.299 2.696-1.348 2.696-1.198 0-1.348-.599-1.348-2.995V82.53h-2.096zM49.275 82.532v10.633h2.097v-4.792h2.546v4.792h2.096V82.532h-2.096v4.043h-2.546v-4.043zM5.992 82.532v10.633h5.392v-1.647H8.089v-2.996h2.995v-1.498H8.089v-2.845h3.295v-1.647zM38.937 82.532v10.633h4.942v-1.647h-3.145v-8.986zM81.937 82.532h1.947v10.633h-1.947z"/></svg>';
        var ehOppSvg = '<svg id="eho" data-name="eho" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 235.36 224.9" role="img" aria-labelledby="ehoTitle"><defs><style>.cls-eh{fill-rule:evenodd;fill:' + color + ';}</style></defs><title id="ehoTitle">Equal Housing Opportunity</title><path class="cls-eh" d="M27,183.8h-9.2v3.64h8.45v3.08H17.81V195h9.61v3.08H14.26V180.73H27Zm11.65,9.56L40.4,195a4.19,4.19,0,0,1-2,.46c-2,0-4.71-1.2-4.71-6.06s2.75-6.06,4.71-6.06,4.71,1.21,4.71,6.06a7.68,7.68,0,0,1-.8,3.73l-1.83-1.72Zm8.19,4L45,195.59a9.75,9.75,0,0,0,1.82-6.19c0-8.14-6.05-9.13-8.34-9.13s-8.33,1-8.33,9.13,6,9.13,8.33,9.13a8.88,8.88,0,0,0,4.44-1.16l2.06,2,1.91-2Zm17-5.36c0,4.56-2.75,6.52-7.13,6.52a7.38,7.38,0,0,1-5.5-2.1,6.27,6.27,0,0,1-1.36-4.2v-11.5h3.7V192c0,2.43,1.4,3.48,3.09,3.48,2.49,0,3.5-1.2,3.5-3.3V180.73h3.71V192Zm9.71-7.37h.06l2.14,6.87H71.31Zm-3.19,9.85h6.4l1.12,3.59H81.8l-6.1-17.35H71.51l-6.18,17.35h3.81Zm17.91.45h8.62v3.14H84.63V180.73h3.63Zm22.36-4.65v7.79H107V180.73h3.62v6.57h6.77v-6.57H121v17.35h-3.62v-7.79Zm17.3-.89c0-4.85,2.76-6.06,4.71-6.06s4.71,1.21,4.71,6.06-2.75,6.06-4.71,6.06S127.92,194.26,127.92,189.4Zm-3.62,0c0,8.15,6,9.13,8.33,9.13s8.34-1,8.34-9.13-6-9.13-8.34-9.13S124.3,181.26,124.3,189.4Zm34,2.61c0,4.56-2.76,6.52-7.13,6.52a7.4,7.4,0,0,1-5.51-2.1,6.27,6.27,0,0,1-1.35-4.2v-11.5H148V192c0,2.43,1.41,3.48,3.1,3.48,2.49,0,3.5-1.2,3.5-3.3V180.73h3.7V192Zm6.63.72c0,1,.52,2.81,3.68,2.81,1.72,0,3.63-.41,3.63-2.25,0-1.35-1.31-1.72-3.14-2.15l-1.86-.44c-2.81-.65-5.52-1.27-5.52-5.09,0-1.93,1.05-5.34,6.68-5.34,5.32,0,6.74,3.48,6.76,5.6h-3.48c-.09-.76-.38-2.6-3.55-2.6-1.37,0-3,.5-3,2.07,0,1.36,1.11,1.64,1.83,1.81l4.24,1c2.36.58,4.53,1.55,4.53,4.67,0,5.22-5.31,5.67-6.83,5.67-6.33,0-7.41-3.64-7.41-5.79h3.46Zm17.38,5.35h-3.62V180.73h3.62v17.35Zm14.48-17.35h3.38v17.35h-3.62l-7.08-12.38h-.06v12.38H186V180.73h3.82l6.88,12.08h.06V180.73Zm15.51,8h7.24v9.35H217.1l-.36-2.17a6.42,6.42,0,0,1-5.42,2.62c-4.18,0-8-3-8-9.08,0-4.73,2.64-9.21,8.48-9.18,5.32,0,7.43,3.45,7.61,5.85h-3.62a3.81,3.81,0,0,0-3.8-2.85c-2.59,0-5,1.78-5,6.22,0,4.74,2.59,6,5.05,6,.8,0,3.47-.31,4.21-3.81h-4v-2.92Zm-195.16,27c0-4.86,2.75-6.07,4.71-6.07s4.71,1.21,4.71,6.07-2.76,6.07-4.71,6.07S17.11,220.61,17.11,215.76Zm-3.63,0c0,8.14,6,9.14,8.34,9.14s8.33-1,8.33-9.14-6-9.13-8.33-9.13S13.48,207.62,13.48,215.76Zm26.6-.58v-5.11H43c2.24,0,3.19.71,3.19,2.4,0,.78,0,2.71-2.71,2.71Zm0,3h4.15a5.32,5.32,0,0,0,5.54-5.54c0-3.4-2-5.56-5.39-5.56H36.46v17.36h3.62v-6.26Zm19.52-3v-5.11h2.87c2.25,0,3.19.71,3.19,2.4,0,.78,0,2.71-2.7,2.71Zm0,3h4.16a5.32,5.32,0,0,0,5.53-5.54c0-3.4-2-5.56-5.39-5.56H56v17.36H59.6v-6.26Zm18.75-2.42c0-4.86,2.75-6.07,4.71-6.07s4.71,1.21,4.71,6.07-2.76,6.07-4.71,6.07S78.35,220.61,78.35,215.76Zm-3.62,0c0,8.14,6,9.14,8.33,9.14s8.33-1,8.33-9.14-6-9.13-8.33-9.13S74.73,207.62,74.73,215.76Zm26.53-1v-4.65h4.51c2.13,0,2.53,1.36,2.53,2.28,0,1.72-.91,2.37-2.8,2.37Zm-3.56,9.72h3.56v-6.79H105c2.68,0,2.83.91,2.83,3.28a11.46,11.46,0,0,0,.38,3.51h4V224c-.77-.29-.77-.92-.77-3.45,0-3.24-.78-3.77-2.2-4.4a4.12,4.12,0,0,0,2.68-4.13c0-1.5-.84-4.9-5.46-4.9H97.69v17.35Zm27.73,0h-3.62V210.16h-5.24v-3.07h14.11v3.07h-5.25Zm24.7-6.07c0,4.56-2.76,6.53-7.14,6.53a7.46,7.46,0,0,1-5.5-2.11,6.34,6.34,0,0,1-1.35-4.2v-11.5h3.69v11.25c0,2.42,1.41,3.49,3.1,3.49,2.48,0,3.5-1.22,3.5-3.32V207.08h3.7v11.29Zm17.53-11.28h3.39v17.35h-3.63l-7.08-12.38h0v12.38h-3.39V207.09h3.82l6.89,12.07h0V207.09Zm13.61,17.35h-3.63V207.09h3.63v17.35Zm14.15,0H191.8V210.16h-5.23v-3.07h14.1v3.07h-5.25Zm19,0h-3.63v-6.55l-6-10.8H209l3.6,7.54,3.43-7.54h4.11l-5.8,10.84v6.51ZM116.81,0,0,57.53v27H13.07v81.07H219.66V84.55h15.7v-27Zm77.58,141.2h-156V67.12L116.81,27l77.58,40.1V141.2Z"/><path class="cls-eh" d="M152.54,93.26H80.2V67.12h72.34Zm0,37.5H80.2V104.6h72.34Z"/></svg>';
        if (this.ehOpportunity == true) {
            ehSvg = ehOppSvg;
        }
        buildSvg(ehSvg, this.ehTarget, this.ehLink, this.ehLinkClass);
    },

    buildNcua: function(color) {
        var color = this.ncuaColorText !== '' ? this.ncuaColorText : this.allColors;
        var fill = this.ncuaColorFill;
        var ncuaSvg = '<svg style="max-width:100%" id="ncuaSvg" data-name="ncua" xmlns="http://www.w3.org/2000/svg" width="542" height="252" viewBox="0 0 547 252" role="img" aria-labelledby="ncuaTitle"><defs><style>.cls-1,.cls-2{fill:' + fill + ';stroke:' + color + ';}.cls-1{stroke-width:4.5px;}.cls-2{stroke-width:7px;}.cls-3{fill:' + color + ';}</style></defs><title id="ncuaTitle">Federally Insured by NCUA</title><rect class="cls-1" x="0" y="0" width="540" height="252"/><rect class="cls-2" x="22.5" y="22.5" width="495.13" height="207"/><text class="cls-3" x="47" y="212" font-family="Helvetica, Arial" font-weight="bold" style="font-size:14.5px">National Credit Union Administration, a U.S. Government Agency</text><text class="cls-3" x="106" y="50" font-family="Helvetica, Arial" font-weight="bold" style="font-size:13.5px">Your savings federally insured to at least $250,000</text><text class="cls-3" x="40" y="70" font-family="Helvetica, Arial" font-weight="bold" style="font-size:13.5px">and backed by the full faith and credit of the United States Government</text><path class="cls-3" d="M227.07,270H250l29.76,52.8H280V270h21v85.68H278.07l-29.76-53.4h-.24v53.4h-21Z" transform="translate(-123 -177)"/><path class="cls-3" d="M373.11,300.6c-1.2-8.64-7.92-13.2-17.28-13.2-14.4,0-19.92,12.72-19.92,25.44s5.52,25.44,19.92,25.44c10.44,0,16.44-6,17.28-15.84h22.32c-1.2,22.08-17.4,35-39.12,35-25.92,0-42.71-19.8-42.71-44.64s16.79-44.64,42.71-44.64c18.48,0,38.52,11.76,39.12,32.4Z" transform="translate(-123 -177)"/><path class="cls-3" d="M481.35,320.28c0,24.84-11.4,37.2-37.32,37.2s-37.32-12.36-37.32-37.2V270H429v51.6c0,11,4.08,16.68,15,16.68s15-5.64,15-16.68V270h22.32Z" transform="translate(-123 -177)"/><path class="cls-3" d="M519.51,270h22.68l32,85.68H551l-5.28-15.36H515.79l-5.4,15.36H487.47ZM521,323.76h19.44l-9.48-30h-.24Z" transform="translate(-123 -177)"/></svg>';
        var ncuaTextOnlySvg = '<svg version="1.1" id="ncuaSvg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 343.9 139.9" xml:space="preserve" role="img" aria-labelledby="ncuaTitle"><defs><title id="ncuaTitle">Federally Insured by NCUA</title><style type="text/css">.st0{font-family:"Roboto","Arial",sans-serif;} .st1{font-size:35px;} .cls-3 {fill:' + color + ';}</style></defs><path d="M0,55h22.7l29.5,52.3h0.2V55h20.8v84.9H50.5L21,87h-0.2v52.9H0V55z" class="cls-3"/><path class="cls-3" d="M144.7,85.3c-1.2-8.6-7.8-13.1-17.1-13.1c-14.3,0-19.7,12.6-19.7,25.2s5.5,25.2,19.7,25.2c10.3,0,16.3-5.9,17.1-15.7h22.1c-1.2,21.9-17.2,34.7-38.8,34.7c-25.7,0-42.3-19.6-42.3-44.2s16.6-44.2,42.3-44.2c18.3,0,38.2,11.7,38.8,32.1L144.7,85.3z"/><path class="cls-3" d="M252,104.8c0,24.6-11.3,36.9-37,36.9s-37-12.2-37-36.9V55h22.1v51.1c0,10.9,4,16.5,14.9,16.5s14.9-5.6,14.9-16.5V55h22.1L252,104.8z"/><path class="cls-3" d="M289.8,55h22.5l31.7,84.9h-23l-5.2-15.2h-29.7l-5.4,15.2H258L289.8,55z M291.2,108.3h19.3l-9.4-29.7h-0.2L291.2,108.3z"/><text transform="matrix(1 0 0 1 -0.9995 32.939)" class="st0 st1 cls-3">Federally Insured by</text></svg>';
        if (this.ncuaUseText == true) {
            ncuaSvg = ncuaTextOnlySvg;
        }
        buildSvg(ncuaSvg, this.ncuaTarget, this.ncuaLink, this.ncuaLinkClass);
    },

    buildNcuaHover: function(color) {
        var hoverColor = this.ncuaHoverColorText;
        var hoverFill = this.ncuaHoverColorFill;
        var ncuaHoverSvg = '<svg id="ncuaHoverSvg" data-name="ncua-hover" xmlns="http://www.w3.org/2000/svg" width="542" height="252" viewBox="0 0 547 252" role="img" labelledby="ncuaHoverTitle"><title id="ncuaHoverTitle">Federally Insured by NCUA</title><defs><style>.hcls-1,.hcls-2{fill:' + hoverFill + ';stroke:' + hoverColor + ';}.hcls-1{stroke-width:4.5px;}.hcls-2{stroke-width:7px;}.hcls-3{fill:' + hoverColor + ';}</style></defs><title id="ncuaTitle">Federally Insured by NCUA</title><!--<rect class="hcls-1" x="0" y="0" width="547" height="252"/>--><rect class="hcls-2" x="22.5" y="22.5" width="500" height="207"/><text class="hcls-3" x="47" y="212" font-family="Helvetica, Arial" font-weight="bold" style="font-size:14.5px">National Credit Union Administration, a U.S. Government Agency</text><text class="hcls-3" x="106" y="50" font-family="Helvetica, Arial" font-weight="bold" style="font-size:13.5px">Your savings federally insured to at least $250,000</text><text class="hcls-3" x="40" y="70" font-family="Helvetica, Arial" font-weight="bold" style="font-size:13.5px">and backed by the full faith and credit of the United States Government</text><path class="hcls-3" d="M227.07,270H250l29.76,52.8H280V270h21v85.68H278.07l-29.76-53.4h-.24v53.4h-21Z" transform="translate(-123 -177)"/><path class="hcls-3" d="M373.11,300.6c-1.2-8.64-7.92-13.2-17.28-13.2-14.4,0-19.92,12.72-19.92,25.44s5.52,25.44,19.92,25.44c10.44,0,16.44-6,17.28-15.84h22.32c-1.2,22.08-17.4,35-39.12,35-25.92,0-42.71-19.8-42.71-44.64s16.79-44.64,42.71-44.64c18.48,0,38.52,11.76,39.12,32.4Z" transform="translate(-123 -177)"/><path class="hcls-3" d="M481.35,320.28c0,24.84-11.4,37.2-37.32,37.2s-37.32-12.36-37.32-37.2V270H429v51.6c0,11,4.08,16.68,15,16.68s15-5.64,15-16.68V270h22.32Z" transform="translate(-123 -177)"/><path class="hcls-3" d="M519.51,270h22.68l32,85.68H551l-5.28-15.36H515.79l-5.4,15.36H487.47ZM521,323.76h19.44l-9.48-30h-.24Z" transform="translate(-123 -177)"/></svg>';
        var ncuaHoverTextOnlySvg = '<svg version="1.1" id="ncuaHoverSvg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 343.9 139.9" xml:space="preserve" role="img" labelledby="ncuaTitle"><defs><title id="ncuaTitle">Federally Insured by NCUA</title><style type="text/css">.hst0{font-family:"Roboto","Arial",sans-serif;} .hst1{font-size:35px;} .hcls-3 {fill:' + hoverColor + ';}</style></defs><path d="M0,55h22.7l29.5,52.3h0.2V55h20.8v84.9H50.5L21,87h-0.2v52.9H0V55z" class="hcls-3"/><path class="hcls-3" d="M144.7,85.3c-1.2-8.6-7.8-13.1-17.1-13.1c-14.3,0-19.7,12.6-19.7,25.2s5.5,25.2,19.7,25.2c10.3,0,16.3-5.9,17.1-15.7h22.1c-1.2,21.9-17.2,34.7-38.8,34.7c-25.7,0-42.3-19.6-42.3-44.2s16.6-44.2,42.3-44.2c18.3,0,38.2,11.7,38.8,32.1L144.7,85.3z"/><path class="hcls-3" d="M252,104.8c0,24.6-11.3,36.9-37,36.9s-37-12.2-37-36.9V55h22.1v51.1c0,10.9,4,16.5,14.9,16.5s14.9-5.6,14.9-16.5V55h22.1L252,104.8z"/><path class="hcls-3" d="M289.8,55h22.5l31.7,84.9h-23l-5.2-15.2h-29.7l-5.4,15.2H258L289.8,55z M291.2,108.3h19.3l-9.4-29.7h-0.2L291.2,108.3z"/><text transform="matrix(1 0 0 1 -0.9995 32.939)" class="hst0 hst1 hcls-3">Federally Insured by</text></svg>';
        if (this.ncuaUseText == true) {
            ncuaHoverSvg = ncuaHoverTextOnlySvg;
        }
        buildSvg(ncuaHoverSvg, this.ncuaHoverTarget, this.ncuaLink, this.ncuaLinkClass);
    },

    buildFirstbranch: function(color) {
        var color = this.firstbranchColor !== '' ? this.firstbranchColor : this.allColors;
        var color2 = this.firstbranchColor2 !== '' ? this.firstbranchColor2 : this.allColors;
        var firstbranchSvg = '<svg id="fbSvg" data-name="fbSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 322.46 91.34" role="img" aria-labelledby="title"><title id="title">Powered by FIRSTBranch</title><defs><style>.cls-4{fill:' + color + ';}.cls-5{fill:' + color2 + ';}</style></defs><path class="cls-4" d="M0,50.68H26.6v8.06H8.74v8.06H25.26v8.06H8.74V90.33H0Z"/><path class="cls-4" d="M35.56,50.68h8.74V90.33H35.56Z"/><path class="cls-4" d="M55,50.68H70.39a27.11,27.11,0,0,1,5.74.59,13.65,13.65,0,0,1,4.76,2,9.79,9.79,0,0,1,3.25,3.7,12.52,12.52,0,0,1,1.2,5.8,11.64,11.64,0,0,1-2.18,7.14,9.83,9.83,0,0,1-6.38,3.72L86.85,90.33H76.38L68.09,74.48H63.78V90.33H55Zm8.74,16.41h5.15q1.18,0,2.49-.08a7.79,7.79,0,0,0,2.38-.5,4.12,4.12,0,0,0,1.76-1.32,4,4,0,0,0,.7-2.52,4.18,4.18,0,0,0-.62-2.41,4.12,4.12,0,0,0-1.57-1.37,7,7,0,0,0-2.18-.64,17.76,17.76,0,0,0-2.41-.17H63.78Z"/><path class="cls-4" d="M113.73,60.37a6.22,6.22,0,0,0-2.88-2,10.35,10.35,0,0,0-3.44-.64,9.08,9.08,0,0,0-2,.22,7.5,7.5,0,0,0-1.9.7,4.14,4.14,0,0,0-1.46,1.26,3.49,3.49,0,0,0,.78,4.65,12.7,12.7,0,0,0,3.39,1.62q2,.67,4.4,1.34a18.13,18.13,0,0,1,4.4,1.9,10.42,10.42,0,0,1,3.39,3.3,10.07,10.07,0,0,1,1.34,5.54,12.76,12.76,0,0,1-1.23,5.77,11.71,11.71,0,0,1-3.33,4.09,14.16,14.16,0,0,1-4.87,2.41,22.34,22.34,0,0,1-13-.39,17.93,17.93,0,0,1-6.16-3.81l6.22-6.83a9.06,9.06,0,0,0,3.39,2.77,9.67,9.67,0,0,0,4.23,1,9.57,9.57,0,0,0,2.16-.25,7,7,0,0,0,2-.76,4.22,4.22,0,0,0,1.4-1.29,3.21,3.21,0,0,0,.53-1.85,3.36,3.36,0,0,0-1.37-2.83,12.67,12.67,0,0,0-3.44-1.76q-2.07-.73-4.48-1.46a20.09,20.09,0,0,1-4.48-2,10.8,10.8,0,0,1-3.44-3.25,9.29,9.29,0,0,1-1.37-5.32A11.91,11.91,0,0,1,93.71,57a12.16,12.16,0,0,1,3.36-4,14.63,14.63,0,0,1,4.84-2.44,19.86,19.86,0,0,1,5.66-.81,22.24,22.24,0,0,1,6.5,1,15,15,0,0,1,5.66,3.19Z"/><path class="cls-4" d="M136.75,58.41H125.44V50.68H156.8v7.73H145.49V90.33h-8.74Z"/><path class="cls-4" d="M179.84,70.29c2.65-1.28,3.95-3.77,3.95-7.56V59.53c0-6.09-3.63-9.18-10.8-9.18h-9.8V90.83h10.08c7.17,0,10.8-3.15,10.8-9.35V77.84C184.07,74.07,182.71,71.64,179.84,70.29Zm0-7.51c0,4-1.76,5.77-5.88,5.77H167.1V54.21h5.83c4.94,0,6.95,1.69,6.95,5.83ZM167.1,72h6.78c4.22,0,6.28,1.85,6.28,5.66V81c0,4.3-2,6.05-6.95,6.05H167.1Z"/><path class="cls-4" d="M202.6,58c-3.24,0-5.84,1.13-7.4,3.17V58.42h-3.69V90.83h3.8v-19c0-7.27,2-10,7.28-10h.5V58Z"/><path class="cls-4" d="M223.89,58.42V61a9.06,9.06,0,0,0-7.06-3c-5.85,0-9.35,3.83-9.35,10.24v12.6c0,6.52,3.49,10.41,9.35,10.41a9,9,0,0,0,7.06-3.07v2.62h3.69V58.42Zm-6.33,29.4c-4,0-6.28-2.51-6.28-7.06V68.44c0-4.45,2.29-7,6.28-7s6.16,2.51,6.16,6.72v12.6C223.72,85.24,221.47,87.82,217.56,87.82Z"/><path class="cls-4" d="M246.68,58a9,9,0,0,0-7.06,3V58.42h-3.69V90.83h3.8V69.11c0-5.09,2.09-7.68,6.22-7.68s6.28,2.55,6.28,7v22.4h3.86V68.27C256.08,61.85,252.57,58,246.68,58Z"/><path class="cls-4" d="M283.52,69.16v-.5c0-6.66-3.75-10.64-10-10.64s-10.08,4.05-10.08,10.58V80.81c0,6.46,3.86,10.47,10.08,10.47s10-3.91,10-10.47v-.5h-3.86v.5c0,4.48-2.19,6.95-6.16,6.95s-6.28-2.45-6.28-6.72V68.55c0-4.55,2.17-6.95,6.28-6.95s6.16,2.51,6.16,7.06v.5Z"/><path class="cls-4" d="M301.95,58a8.79,8.79,0,0,0-7.06,3V47.66h-3.8V90.83h3.8V68.27c0-4.37,2.21-6.78,6.22-6.78,5.19,0,6.28,3.75,6.28,6.89V90.83h3.86V68.16C311.24,61.81,307.77,58,301.95,58Z"/><path class="cls-5" d="M16.66,21a22,22,0,0,1-.44,4.56,12.63,12.63,0,0,1-1.32,3.63,6.91,6.91,0,0,1-2.18,2.42,5.28,5.28,0,0,1-3,.86,4.51,4.51,0,0,1-3-1A5.36,5.36,0,0,1,5,28.94H4.94V41.83H.28V10.33H4.86v3h.08a6.71,6.71,0,0,1,1.64-2.67A4.31,4.31,0,0,1,9.73,9.62a5.19,5.19,0,0,1,3,.86,7.05,7.05,0,0,1,2.16,2.39,12.79,12.79,0,0,1,1.34,3.61A20.84,20.84,0,0,1,16.66,21Zm-4.75,0a18.56,18.56,0,0,0-.21-2.86,9.56,9.56,0,0,0-.63-2.31A4.1,4.1,0,0,0,10,14.3a2.4,2.4,0,0,0-1.6-.57,2.34,2.34,0,0,0-1.55.57,4.29,4.29,0,0,0-1.11,1.53A9.4,9.4,0,0,0,5,18.14a17.74,17.74,0,0,0,0,5.71,9.75,9.75,0,0,0,.67,2.33,4.26,4.26,0,0,0,1.11,1.55,2.33,2.33,0,0,0,1.55.57,2.39,2.39,0,0,0,1.6-.57,4.07,4.07,0,0,0,1.09-1.55,9.9,9.9,0,0,0,.63-2.33A18.54,18.54,0,0,0,11.91,21Z"/><path class="cls-5" d="M38.71,21.08a17.66,17.66,0,0,1-.57,4.62,11,11,0,0,1-1.64,3.59,7.87,7.87,0,0,1-2.59,2.33,7.52,7.52,0,0,1-6.91,0,7.87,7.87,0,0,1-2.59-2.33,11,11,0,0,1-1.64-3.59,17.66,17.66,0,0,1-.57-4.62,18.08,18.08,0,0,1,.57-4.68,11.52,11.52,0,0,1,1.62-3.63A7.34,7.34,0,0,1,27,10.44a7.27,7.27,0,0,1,3.47-.82,7.15,7.15,0,0,1,3.45.82,7.58,7.58,0,0,1,2.59,2.33,11.23,11.23,0,0,1,1.64,3.63A18.08,18.08,0,0,1,38.71,21.08ZM34,21a18.43,18.43,0,0,0-.21-2.88,9.22,9.22,0,0,0-.65-2.31A4.41,4.41,0,0,0,32,14.3a2.47,2.47,0,0,0-3.15,0,4.2,4.2,0,0,0-1.07,1.55,9.82,9.82,0,0,0-.63,2.31,19.67,19.67,0,0,0,0,5.73,9.47,9.47,0,0,0,.63,2.31,4.21,4.21,0,0,0,1.07,1.53,2.31,2.31,0,0,0,1.58.57,2.39,2.39,0,0,0,1.6-.57,4.1,4.1,0,0,0,1.09-1.53,9.51,9.51,0,0,0,.63-2.31A18.54,18.54,0,0,0,34,21Z"/><path class="cls-5" d="M64,31.75H58.91L55.84,17.09h0L52.74,31.75h-5L43.2,10.33h4.87l2.6,15.75h.08l3.07-15.75H58l3.15,15.75h.08l2.65-15.75h4.75Z"/><path class="cls-5" d="M77.89,22.26a10.72,10.72,0,0,0,.25,2.37,6.68,6.68,0,0,0,.74,1.93,4.08,4.08,0,0,0,1.18,1.3,2.76,2.76,0,0,0,1.62.48,2.7,2.7,0,0,0,2.08-.84A6.63,6.63,0,0,0,85,25.58l3.49,2a8.52,8.52,0,0,1-2.62,3.55,6.87,6.87,0,0,1-4.35,1.32,7.21,7.21,0,0,1-6-2.94q-2.27-2.94-2.27-8.44a17.52,17.52,0,0,1,.59-4.68,11.31,11.31,0,0,1,1.68-3.63,7.83,7.83,0,0,1,2.58-2.33,7.48,7.48,0,0,1,6.85,0,6.69,6.69,0,0,1,2.35,2.29,10.57,10.57,0,0,1,1.32,3.42A20.57,20.57,0,0,1,89,20.45v1.81Zm6.59-3.44a8.61,8.61,0,0,0-.76-3.88,2.48,2.48,0,0,0-2.35-1.49A2.37,2.37,0,0,0,79.8,14a4.09,4.09,0,0,0-1,1.37,8.54,8.54,0,0,0-.82,3.46Z"/><path class="cls-5" d="M102.21,10.84A3.73,3.73,0,0,1,105,9.62h.36a1,1,0,0,1,.36.08l-.25,4.87a3.82,3.82,0,0,0-1-.13,2.56,2.56,0,0,0-1.64.57,4.81,4.81,0,0,0-1.22,1.49,7.77,7.77,0,0,0-.76,2.1,11.33,11.33,0,0,0-.25,2.39V31.75H95.74V10.33h4.66v4.12h.08A7.52,7.52,0,0,1,102.21,10.84Z"/><path class="cls-5" d="M114.05,22.26a10.72,10.72,0,0,0,.25,2.37,6.68,6.68,0,0,0,.74,1.93,4.08,4.08,0,0,0,1.18,1.3,2.76,2.76,0,0,0,1.62.48,2.7,2.7,0,0,0,2.08-.84,6.63,6.63,0,0,0,1.24-1.93l3.49,2A8.52,8.52,0,0,1,122,31.14a6.87,6.87,0,0,1-4.35,1.32,7.21,7.21,0,0,1-6-2.94q-2.27-2.94-2.27-8.44A17.52,17.52,0,0,1,110,16.4a11.31,11.31,0,0,1,1.68-3.63,7.83,7.83,0,0,1,2.58-2.33,7.48,7.48,0,0,1,6.85,0,6.69,6.69,0,0,1,2.35,2.29,10.57,10.57,0,0,1,1.32,3.42,20.57,20.57,0,0,1,.42,4.28v1.81Zm6.59-3.44a8.61,8.61,0,0,0-.76-3.88,2.48,2.48,0,0,0-2.35-1.49A2.37,2.37,0,0,0,116,14a4.09,4.09,0,0,0-1,1.37,8.54,8.54,0,0,0-.82,3.46Z"/><path class="cls-5" d="M142.36,31.75V28.69h-.08a6.06,6.06,0,0,1-1.58,2.69,4.4,4.4,0,0,1-3.21,1.09,5.12,5.12,0,0,1-2.94-.88,7.06,7.06,0,0,1-2.18-2.46,13.37,13.37,0,0,1-1.34-3.7,21.61,21.61,0,0,1-.46-4.6,21.46,21.46,0,0,1,.44-4.49,11.78,11.78,0,0,1,1.32-3.55,7,7,0,0,1,2.16-2.33,5.34,5.34,0,0,1,3-.84,4.59,4.59,0,0,1,3,1,5.06,5.06,0,0,1,1.68,2.46h.13V0h4.66V31.75ZM142.45,21a16.82,16.82,0,0,0-.23-2.88,9.81,9.81,0,0,0-.67-2.31,4.15,4.15,0,0,0-1.13-1.55,2.42,2.42,0,0,0-1.58-.57,2.39,2.39,0,0,0-1.6.57,4.08,4.08,0,0,0-1.09,1.55,9.82,9.82,0,0,0-.63,2.31,18.31,18.31,0,0,0-.21,2.88,18,18,0,0,0,.21,2.83,9.81,9.81,0,0,0,.63,2.31,4.07,4.07,0,0,0,1.09,1.55,2.53,2.53,0,0,0,3.19,0,4.27,4.27,0,0,0,1.11-1.55,9.81,9.81,0,0,0,.67-2.31A16.55,16.55,0,0,0,142.45,21Z"/><path class="cls-5" d="M165.59,0h4.75V13h.08a4.93,4.93,0,0,1,1.67-2.44,4.62,4.62,0,0,1,3-1,5.34,5.34,0,0,1,3,.84,6.88,6.88,0,0,1,2.18,2.33,11.81,11.81,0,0,1,1.32,3.55,21.53,21.53,0,0,1,.44,4.49,21.68,21.68,0,0,1-.46,4.6,13.43,13.43,0,0,1-1.34,3.7A7.06,7.06,0,0,1,178,31.58a5.09,5.09,0,0,1-2.93.88,4.3,4.3,0,0,1-3.18-1.09,6.49,6.49,0,0,1-1.59-2.69h-.08v3.07h-4.62Zm4.58,21a16.46,16.46,0,0,0,.23,2.83,9.76,9.76,0,0,0,.67,2.31,4.26,4.26,0,0,0,1.11,1.55,2.44,2.44,0,0,0,3.13,0,4.2,4.2,0,0,0,1.07-1.55,9.91,9.91,0,0,0,.63-2.31,18.14,18.14,0,0,0,.21-2.83,18.56,18.56,0,0,0-.21-2.86,9.93,9.93,0,0,0-.63-2.33,4.21,4.21,0,0,0-1.07-1.55,2.44,2.44,0,0,0-3.13,0,4.27,4.27,0,0,0-1.11,1.55,9.77,9.77,0,0,0-.67,2.33A16.84,16.84,0,0,0,170.17,21Z"/><path class="cls-5" d="M197.09,34.73a20.7,20.7,0,0,1-1,2.91,8.21,8.21,0,0,1-1.41,2.25,5.69,5.69,0,0,1-2,1.44,6.8,6.8,0,0,1-2.71.5,12.17,12.17,0,0,1-1.62-.1,7.3,7.3,0,0,1-1.28-.27l.59-4.25a6,6,0,0,0,.82.23,4.42,4.42,0,0,0,.95.11,2.13,2.13,0,0,0,1.72-.69,4.58,4.58,0,0,0,.88-1.91l.63-2.65-6.26-21.92h5l3.74,16.13h.13l3.4-16.13h4.83Z"/><path class="cls-4" d="M314.59,51.38a3.84,3.84,0,0,1,.32-1.56A4,4,0,0,1,320,47.75a4,4,0,0,1,1.25.82,3.9,3.9,0,0,1,.85,1.23,3.75,3.75,0,0,1,.31,1.54,3.84,3.84,0,0,1-.31,1.56A4,4,0,0,1,317,55a4,4,0,0,1-1.25-.82,3.9,3.9,0,0,1-.85-1.23A3.74,3.74,0,0,1,314.59,51.38Zm.63,0a3.29,3.29,0,0,0,.26,1.31,3.24,3.24,0,0,0,.71,1,3.36,3.36,0,0,0,1.05.7,3.37,3.37,0,0,0,2.58,0,3.33,3.33,0,0,0,1.05-.71,3.29,3.29,0,0,0,.71-1.07,3.41,3.41,0,0,0,.26-1.33,3.34,3.34,0,0,0-.26-1.31,3.25,3.25,0,0,0-.71-1.06,3.29,3.29,0,0,0-2.34-1,3.23,3.23,0,0,0-1.29.26,3.38,3.38,0,0,0-1.05.7,3.22,3.22,0,0,0-.71,1.06A3.43,3.43,0,0,0,315.22,51.38Zm1.85-2.26h1.66a1.92,1.92,0,0,1,1.21.31,1.19,1.19,0,0,1,.39,1,1.09,1.09,0,0,1-.35.89,1.57,1.57,0,0,1-.85.34l1.3,2h-.68l-1.24-1.94h-.81v1.94h-.63Zm.63,2h.78l.45,0a1.23,1.23,0,0,0,.39-.09.61.61,0,0,0,.27-.22.75.75,0,0,0,.1-.42.69.69,0,0,0-.09-.37.58.58,0,0,0-.24-.22,1,1,0,0,0-.33-.09l-.36,0h-1Z"/></svg>';
        buildSvg(firstbranchSvg, this.firstbranchTarget, this.firstbranchLink, this.firstbranchLinkClass);
    },

    buildAll: function() {
        this.buildFdic();
        this.buildFdicBand();
        this.buildEh();
        if (this.ncuaHover == true) {
            this.buildNcuaHover();
        };
        this.buildNcua();
        this.buildFirstbranch();

        // inject print CSS
        var printStyles = '@media print { #fdic svg g, #fdicBand svg path, #fdicBand svg polygon, .fdic-svg, #eh svg path, #ncua .cls-3, #bv-logo .cls-4, #bv-logo .cls-5 { fill: #000; } #ncua .cls-1, #ncua .cls-2 { stroke: #000; } }';
        var compliancePrint = document.createElement('style');
        compliancePrint.innerHTML = printStyles;
        document.body.appendChild(compliancePrint);

    }
}

function buildSvg(svgSrc, el, link, linkClass) {
    var parser = new DOMParser();
    var svgEl = parser.parseFromString(svgSrc, "image/svg+xml");
    var el = document.getElementById(el);
    var link = link;
    var linkClass = linkClass;

    if (!link && el) {
        el.appendChild(svgEl.documentElement);
    }

    if (link && el) {
        var thelink = document.createElement('a');
        thelink.href = link;
        thelink.className = linkClass;
        el.appendChild(thelink);
        el.firstChild.appendChild(svgEl.documentElement);
    }
}