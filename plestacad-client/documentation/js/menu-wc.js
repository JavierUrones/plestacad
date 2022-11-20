'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">plestacad-client documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AdminModule.html" data-type="entity-link" >AdminModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminModule-ef05df321933225ad4e86aa987bb62c056215a14b47614770a4d17b75cd2d2fa42287f39f63396a49ace4f89454c6c4fcf5c101e600b38e8babb0e0c649d538b"' : 'data-target="#xs-components-links-module-AdminModule-ef05df321933225ad4e86aa987bb62c056215a14b47614770a4d17b75cd2d2fa42287f39f63396a49ace4f89454c6c4fcf5c101e600b38e8babb0e0c649d538b"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminModule-ef05df321933225ad4e86aa987bb62c056215a14b47614770a4d17b75cd2d2fa42287f39f63396a49ace4f89454c6c4fcf5c101e600b38e8babb0e0c649d538b"' :
                                            'id="xs-components-links-module-AdminModule-ef05df321933225ad4e86aa987bb62c056215a14b47614770a4d17b75cd2d2fa42287f39f63396a49ace4f89454c6c4fcf5c101e600b38e8babb0e0c649d538b"' }>
                                            <li class="link">
                                                <a href="components/AdminComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-53506ce07575a1949dc0c2641082909b23ad6694ed5ae6313dbecc2e38d278ddeecdda120b1513976d7d1a4cc40630185b99117c77e45a392efbfe103ac048ee"' : 'data-target="#xs-components-links-module-AppModule-53506ce07575a1949dc0c2641082909b23ad6694ed5ae6313dbecc2e38d278ddeecdda120b1513976d7d1a4cc40630185b99117c77e45a392efbfe103ac048ee"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-53506ce07575a1949dc0c2641082909b23ad6694ed5ae6313dbecc2e38d278ddeecdda120b1513976d7d1a4cc40630185b99117c77e45a392efbfe103ac048ee"' :
                                            'id="xs-components-links-module-AppModule-53506ce07575a1949dc0c2641082909b23ad6694ed5ae6313dbecc2e38d278ddeecdda120b1513976d7d1a4cc40630185b99117c77e45a392efbfe103ac048ee"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CalendarModule.html" data-type="entity-link" >CalendarModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CalendarModule-cabbcab5c0438d47707dcfe71028d3e1c1c3909d1911625906d2ba532fb85d7be89a31431eb0f4ddfaef3dd92a26c160a716e57f5d6f178b51d286176b80ef01"' : 'data-target="#xs-components-links-module-CalendarModule-cabbcab5c0438d47707dcfe71028d3e1c1c3909d1911625906d2ba532fb85d7be89a31431eb0f4ddfaef3dd92a26c160a716e57f5d6f178b51d286176b80ef01"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CalendarModule-cabbcab5c0438d47707dcfe71028d3e1c1c3909d1911625906d2ba532fb85d7be89a31431eb0f4ddfaef3dd92a26c160a716e57f5d6f178b51d286176b80ef01"' :
                                            'id="xs-components-links-module-CalendarModule-cabbcab5c0438d47707dcfe71028d3e1c1c3909d1911625906d2ba532fb85d7be89a31431eb0f4ddfaef3dd92a26c160a716e57f5d6f178b51d286176b80ef01"' }>
                                            <li class="link">
                                                <a href="components/CalendarWorkComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CalendarWorkComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DialogNewEvent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogNewEvent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/FilesModule.html" data-type="entity-link" >FilesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FilesModule-1a90ab3ba00e3cb47c5d4412cca11b11282523525f91407ddda8f8a48d5c380c2226c7c497812be293332365e836f54cb752dc37a5e3a086e534712dee51feb3"' : 'data-target="#xs-components-links-module-FilesModule-1a90ab3ba00e3cb47c5d4412cca11b11282523525f91407ddda8f8a48d5c380c2226c7c497812be293332365e836f54cb752dc37a5e3a086e534712dee51feb3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FilesModule-1a90ab3ba00e3cb47c5d4412cca11b11282523525f91407ddda8f8a48d5c380c2226c7c497812be293332365e836f54cb752dc37a5e3a086e534712dee51feb3"' :
                                            'id="xs-components-links-module-FilesModule-1a90ab3ba00e3cb47c5d4412cca11b11282523525f91407ddda8f8a48d5c380c2226c7c497812be293332365e836f54cb752dc37a5e3a086e534712dee51feb3"' }>
                                            <li class="link">
                                                <a href="components/DialogAddDirectory.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogAddDirectory</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DialogUploadFile.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogUploadFile</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FilesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FilesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ForoModule.html" data-type="entity-link" >ForoModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ForoModule-6f4179b72af0646f68699e79daa8f2d6096e861c4e712a5e2b10b2fdb551680ac31804518870f0877d4c37ec8e8fe1a5a26a46f664512fd6c86d227c30588cab"' : 'data-target="#xs-components-links-module-ForoModule-6f4179b72af0646f68699e79daa8f2d6096e861c4e712a5e2b10b2fdb551680ac31804518870f0877d4c37ec8e8fe1a5a26a46f664512fd6c86d227c30588cab"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ForoModule-6f4179b72af0646f68699e79daa8f2d6096e861c4e712a5e2b10b2fdb551680ac31804518870f0877d4c37ec8e8fe1a5a26a46f664512fd6c86d227c30588cab"' :
                                            'id="xs-components-links-module-ForoModule-6f4179b72af0646f68699e79daa8f2d6096e861c4e712a5e2b10b2fdb551680ac31804518870f0877d4c37ec8e8fe1a5a26a46f664512fd6c86d227c30588cab"' }>
                                            <li class="link">
                                                <a href="components/DialogAddPost.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogAddPost</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ForoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ForoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PostListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PostListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PostManagementComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PostManagementComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ForoRoutingModule.html" data-type="entity-link" >ForoRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MainModule.html" data-type="entity-link" >MainModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MainModule-e94c70233f9e77d4d9c447ae768016ecab04ceeae5ee74bc015948d1f01ad43dde4ca5f2ce276423de93e894dfdac69e24abd725deed116e8a69968fbce6c21e"' : 'data-target="#xs-components-links-module-MainModule-e94c70233f9e77d4d9c447ae768016ecab04ceeae5ee74bc015948d1f01ad43dde4ca5f2ce276423de93e894dfdac69e24abd725deed116e8a69968fbce6c21e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MainModule-e94c70233f9e77d4d9c447ae768016ecab04ceeae5ee74bc015948d1f01ad43dde4ca5f2ce276423de93e894dfdac69e24abd725deed116e8a69968fbce6c21e"' :
                                            'id="xs-components-links-module-MainModule-e94c70233f9e77d4d9c447ae768016ecab04ceeae5ee74bc015948d1f01ad43dde4ca5f2ce276423de93e894dfdac69e24abd725deed116e8a69968fbce6c21e"' }>
                                            <li class="link">
                                                <a href="components/MainComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MainComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/NotificationsModule.html" data-type="entity-link" >NotificationsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-NotificationsModule-8b0ce1ad8ddd239ab9c3207ecc0403aefe6e90202c9bff9ea0515ededcda45a4aeb60daf95d4881bb0e41865c847f7fa5b6fcba40de655825d8282078d071a70"' : 'data-target="#xs-components-links-module-NotificationsModule-8b0ce1ad8ddd239ab9c3207ecc0403aefe6e90202c9bff9ea0515ededcda45a4aeb60daf95d4881bb0e41865c847f7fa5b6fcba40de655825d8282078d071a70"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-NotificationsModule-8b0ce1ad8ddd239ab9c3207ecc0403aefe6e90202c9bff9ea0515ededcda45a4aeb60daf95d4881bb0e41865c847f7fa5b6fcba40de655825d8282078d071a70"' :
                                            'id="xs-components-links-module-NotificationsModule-8b0ce1ad8ddd239ab9c3207ecc0403aefe6e90202c9bff9ea0515ededcda45a4aeb60daf95d4881bb0e41865c847f7fa5b6fcba40de655825d8282078d071a70"' }>
                                            <li class="link">
                                                <a href="components/NotificationsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/NotificationsRoutingModule.html" data-type="entity-link" >NotificationsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/OthersModule.html" data-type="entity-link" >OthersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-OthersModule-5e77c49186c4dad83f90cf6ce55f04c06d52a205e0375f3e9689904d8270a8dd57c08531cea1bb10d0a43e8a6d5204af5b3c106d942966fcce2376cd9378b83f"' : 'data-target="#xs-components-links-module-OthersModule-5e77c49186c4dad83f90cf6ce55f04c06d52a205e0375f3e9689904d8270a8dd57c08531cea1bb10d0a43e8a6d5204af5b3c106d942966fcce2376cd9378b83f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-OthersModule-5e77c49186c4dad83f90cf6ce55f04c06d52a205e0375f3e9689904d8270a8dd57c08531cea1bb10d0a43e8a6d5204af5b3c106d942966fcce2376cd9378b83f"' :
                                            'id="xs-components-links-module-OthersModule-5e77c49186c4dad83f90cf6ce55f04c06d52a205e0375f3e9689904d8270a8dd57c08531cea1bb10d0a43e8a6d5204af5b3c106d942966fcce2376cd9378b83f"' }>
                                            <li class="link">
                                                <a href="components/ContactoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ContactoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HelpComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HelpComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LegalInfoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LegalInfoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Pagina404Component.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >Pagina404Component</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/OthersRoutingModule.html" data-type="entity-link" >OthersRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ProfileModule.html" data-type="entity-link" >ProfileModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ProfileModule-6dc3897a7745fd641fceb6216b3252677aacc83230f9f84ba1975cf228a4220ab1f88dbb1b16ac86be919b13a0dd8a448508250937f04e9d531d70174ebf44e1"' : 'data-target="#xs-components-links-module-ProfileModule-6dc3897a7745fd641fceb6216b3252677aacc83230f9f84ba1975cf228a4220ab1f88dbb1b16ac86be919b13a0dd8a448508250937f04e9d531d70174ebf44e1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ProfileModule-6dc3897a7745fd641fceb6216b3252677aacc83230f9f84ba1975cf228a4220ab1f88dbb1b16ac86be919b13a0dd8a448508250937f04e9d531d70174ebf44e1"' :
                                            'id="xs-components-links-module-ProfileModule-6dc3897a7745fd641fceb6216b3252677aacc83230f9f84ba1975cf228a4220ab1f88dbb1b16ac86be919b13a0dd8a448508250937f04e9d531d70174ebf44e1"' }>
                                            <li class="link">
                                                <a href="components/ProfileComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfileRoutingModule.html" data-type="entity-link" >ProfileRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SessionModule.html" data-type="entity-link" >SessionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SessionModule-65896612ec3505752210e4787e15e8506f1f192ae0cc76320ab672795b7fb143e2420fa813a3930f39ff3521953867d301a0265f7e7bdc09c8ce93d40867c584"' : 'data-target="#xs-components-links-module-SessionModule-65896612ec3505752210e4787e15e8506f1f192ae0cc76320ab672795b7fb143e2420fa813a3930f39ff3521953867d301a0265f7e7bdc09c8ce93d40867c584"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SessionModule-65896612ec3505752210e4787e15e8506f1f192ae0cc76320ab672795b7fb143e2420fa813a3930f39ff3521953867d301a0265f7e7bdc09c8ce93d40867c584"' :
                                            'id="xs-components-links-module-SessionModule-65896612ec3505752210e4787e15e8506f1f192ae0cc76320ab672795b7fb143e2420fa813a3930f39ff3521953867d301a0265f7e7bdc09c8ce93d40867c584"' }>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SignupComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SignupComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-fcaec1be4c0c4c8c610e375a45c8b4f95efeb25bb199e95e365efa22abe9b8a50144fcdbe7b597d9fa500d9cf07c17dc0689ad45402b0b100a9183e74c5878a8"' : 'data-target="#xs-components-links-module-SharedModule-fcaec1be4c0c4c8c610e375a45c8b4f95efeb25bb199e95e365efa22abe9b8a50144fcdbe7b597d9fa500d9cf07c17dc0689ad45402b0b100a9183e74c5878a8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-fcaec1be4c0c4c8c610e375a45c8b4f95efeb25bb199e95e365efa22abe9b8a50144fcdbe7b597d9fa500d9cf07c17dc0689ad45402b0b100a9183e74c5878a8"' :
                                            'id="xs-components-links-module-SharedModule-fcaec1be4c0c4c8c610e375a45c8b4f95efeb25bb199e95e365efa22abe9b8a50144fcdbe7b597d9fa500d9cf07c17dc0689ad45402b0b100a9183e74c5878a8"' }>
                                            <li class="link">
                                                <a href="components/ConfirmDialog.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfirmDialog</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CustomBreadcrumbComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CustomBreadcrumbComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SidenavComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SidenavComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TasksModule.html" data-type="entity-link" >TasksModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TasksModule-78519cce11fb1e48124a5edb60f758eb6e2fb4dfff45b18abed9685edfd4e24ba7dd1df823745b7b75d66faebea03656cf5666461c7a900dc0c560a8bb9b061f"' : 'data-target="#xs-components-links-module-TasksModule-78519cce11fb1e48124a5edb60f758eb6e2fb4dfff45b18abed9685edfd4e24ba7dd1df823745b7b75d66faebea03656cf5666461c7a900dc0c560a8bb9b061f"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TasksModule-78519cce11fb1e48124a5edb60f758eb6e2fb4dfff45b18abed9685edfd4e24ba7dd1df823745b7b75d66faebea03656cf5666461c7a900dc0c560a8bb9b061f"' :
                                            'id="xs-components-links-module-TasksModule-78519cce11fb1e48124a5edb60f758eb6e2fb4dfff45b18abed9685edfd4e24ba7dd1df823745b7b75d66faebea03656cf5666461c7a900dc0c560a8bb9b061f"' }>
                                            <li class="link">
                                                <a href="components/BoardComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BoardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DialogManageTask.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogManageTask</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListTasksComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListTasksComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TasksComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TasksComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/VideocallsModule.html" data-type="entity-link" >VideocallsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-VideocallsModule-969eea58d92b6b988f67f0aa0b17aa4c08108f95eac4ce762c91ce95ccb7c9c8ad37a9d8f1d2c6b03842e52fe973574496032201fffabd8bf10e9b7f4ac1b9f7"' : 'data-target="#xs-components-links-module-VideocallsModule-969eea58d92b6b988f67f0aa0b17aa4c08108f95eac4ce762c91ce95ccb7c9c8ad37a9d8f1d2c6b03842e52fe973574496032201fffabd8bf10e9b7f4ac1b9f7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-VideocallsModule-969eea58d92b6b988f67f0aa0b17aa4c08108f95eac4ce762c91ce95ccb7c9c8ad37a9d8f1d2c6b03842e52fe973574496032201fffabd8bf10e9b7f4ac1b9f7"' :
                                            'id="xs-components-links-module-VideocallsModule-969eea58d92b6b988f67f0aa0b17aa4c08108f95eac4ce762c91ce95ccb7c9c8ad37a9d8f1d2c6b03842e52fe973574496032201fffabd8bf10e9b7f4ac1b9f7"' }>
                                            <li class="link">
                                                <a href="components/EntryCallDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EntryCallDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VideocallsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VideocallsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/VideocallsRoutingModule.html" data-type="entity-link" >VideocallsRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/WorkListModule.html" data-type="entity-link" >WorkListModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-WorkListModule-2462db88c158e0e823f6d2c31645fe8df639dce5dd1afb94122f5faf572685857230af37bf7d24b256b7763e551a783f0151a599c9e99a0a3888caee30fc8983"' : 'data-target="#xs-components-links-module-WorkListModule-2462db88c158e0e823f6d2c31645fe8df639dce5dd1afb94122f5faf572685857230af37bf7d24b256b7763e551a783f0151a599c9e99a0a3888caee30fc8983"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-WorkListModule-2462db88c158e0e823f6d2c31645fe8df639dce5dd1afb94122f5faf572685857230af37bf7d24b256b7763e551a783f0151a599c9e99a0a3888caee30fc8983"' :
                                            'id="xs-components-links-module-WorkListModule-2462db88c158e0e823f6d2c31645fe8df639dce5dd1afb94122f5faf572685857230af37bf7d24b256b7763e551a783f0151a599c9e99a0a3888caee30fc8983"' }>
                                            <li class="link">
                                                <a href="components/DialogAddWork.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DialogAddWork</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InfoComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InfoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ManageWorkComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ManageWorkComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalAddUsers.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ModalAddUsers</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/WorkListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WorkListComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/WorkListRoutingModule.html" data-type="entity-link" >WorkListRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/WorkRequestsModule.html" data-type="entity-link" >WorkRequestsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-WorkRequestsModule-f6233f4579e14dc43f97b244d8bffb40a89710c352b8e2068e5215798638dfb4dd7f745791b50a51326216f4ae0c8845534afe820c91f71c58885c4c71c5fb85"' : 'data-target="#xs-components-links-module-WorkRequestsModule-f6233f4579e14dc43f97b244d8bffb40a89710c352b8e2068e5215798638dfb4dd7f745791b50a51326216f4ae0c8845534afe820c91f71c58885c4c71c5fb85"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-WorkRequestsModule-f6233f4579e14dc43f97b244d8bffb40a89710c352b8e2068e5215798638dfb4dd7f745791b50a51326216f4ae0c8845534afe820c91f71c58885c4c71c5fb85"' :
                                            'id="xs-components-links-module-WorkRequestsModule-f6233f4579e14dc43f97b244d8bffb40a89710c352b8e2068e5215798638dfb4dd7f745791b50a51326216f4ae0c8845534afe820c91f71c58885c4c71c5fb85"' }>
                                            <li class="link">
                                                <a href="components/WorkRequestsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WorkRequestsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/WorkRequestsRoutingModule.html" data-type="entity-link" >WorkRequestsRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Interaction.html" data-type="entity-link" >Interaction</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/Work.html" data-type="entity-link" >Work</a>
                            </li>
                            <li class="link">
                                <a href="classes/WorkRequest.html" data-type="entity-link" >WorkRequest</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthenticationService.html" data-type="entity-link" >AuthenticationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CalendarService.html" data-type="entity-link" >CalendarService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FilesService.html" data-type="entity-link" >FilesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationService.html" data-type="entity-link" >NotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotifyNewTaskService.html" data-type="entity-link" >NotifyNewTaskService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotifyTaskChangesService.html" data-type="entity-link" >NotifyTaskChangesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PostService.html" data-type="entity-link" >PostService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ServerSocketsRequestsService.html" data-type="entity-link" >ServerSocketsRequestsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TasksService.html" data-type="entity-link" >TasksService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VideocallsService.html" data-type="entity-link" >VideocallsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WorkRequestService.html" data-type="entity-link" >WorkRequestService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WorkService.html" data-type="entity-link" >WorkService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthInterceptor.html" data-type="entity-link" >AuthInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AdminGuard.html" data-type="entity-link" >AdminGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CalendarEvent.html" data-type="entity-link" >CalendarEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogDataAddPost.html" data-type="entity-link" >DialogDataAddPost</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogDataAddWork.html" data-type="entity-link" >DialogDataAddWork</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogDataNewEvent.html" data-type="entity-link" >DialogDataNewEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogFilesData.html" data-type="entity-link" >DialogFilesData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogManageTaskData.html" data-type="entity-link" >DialogManageTaskData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Notification.html" data-type="entity-link" >Notification</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Post.html" data-type="entity-link" >Post</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PostInteraction.html" data-type="entity-link" >PostInteraction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Task.html" data-type="entity-link" >Task</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TaskClassificator.html" data-type="entity-link" >TaskClassificator</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TreeNode.html" data-type="entity-link" >TreeNode</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});