const USER_JWT = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjkzNDI4ODMsImp0aSI6ImY0ODBjYjQwLTczMWMtMTFlOC1hZDNlLTgxNDNjYzk2NWZlNyIsInN1YiI6Imp1YW5tYSIsImV4cCI6IjE1Mjk0MjkyODMiLCJhY2wiOnsicGF0aHMiOnsiL3YxL3VzZXJzLyoqIjp7fSwiL3YxL2NvbnZlcnNhdGlvbnMvKioiOnt9LCIvdjEvc2Vzc2lvbnMvKioiOnt9LCIvdjEvZGV2aWNlcy8qKiI6e30sIi92MS9pbWFnZS8qKiI6e30sIi92My9tZWRpYS8qKiI6e30sIi92MS9hcHBsaWNhdGlvbnMvKioiOnt9LCIvdjEvcHVzaC8qKiI6e319fSwiYXBwbGljYXRpb25faWQiOiIxYjFmNjFmZS1hNzViLTRhOGUtODRkYi0xZGQ0ZDdlNTdlOTQifQ.UDiGybZef0nhai5YGrHOq7JisXt9C9SJ6KpH_iaHLZ1qKClUBOkh1twG4Y2Ezhlnzmfxyc8qb4cIdou2T640qJqIY_FY0QclgpdhSeLQyksidVhrFPCeU4T82mYbSB8-Ozh-gX6VuyUjTG2E4K_Xd3MIuYylhrcWWf4p7LVfohOoEgRKj-B7UZVYo3fD1jM-ACLyahtry1PpvJx1x-uANPY1ejNMdG3Z8NzpkhLE5yUWlJoZw8itqoumf2cif2nOJCJP_KrM_fGS9g6NVFU6a38Gy6-CY-_HFbVwYYt4TdHNAPnqU2VAIHxXq4bunwlGdFbnTu9QrRSMl8MFqH41tQ'
const SECOND_USER_JWT = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MjkzNDMwMzIsImp0aSI6IjRkOGQ2Y2MwLTczMWQtMTFlOC05MzI2LTNiNTIwOTk2ZjNjZCIsInN1YiI6ImpvcmdlIiwiZXhwIjoiMTUyOTQyOTQzMiIsImFjbCI6eyJwYXRocyI6eyIvdjEvc2Vzc2lvbnMvKioiOnt9LCIvdjEvdXNlcnMvKioiOnt9LCIvdjEvY29udmVyc2F0aW9ucy8qKiI6e319fSwiYXBwbGljYXRpb25faWQiOiIxYjFmNjFmZS1hNzViLTRhOGUtODRkYi0xZGQ0ZDdlNTdlOTQifQ.aE6pSIZulfOo2pLhXmI-f2qE8nA-iEucbQAgTT59ciXkeHxBQv28IIxiReJzmc6qH6wcjzKqBntv1jTas2xYthztmzk3s6WEvgcNMC1QmSNK7CizuMZfXDnfqWkXhVHqVqDl_jaI044_2p9xizOopxMLeFOwgYbzkMyqZWp0qkmajatiiEn_440EQ1K7fG93IEdBNuMFrM6WnnlOUikKhlHxqIjtLKH2C02MBtB5QSvN97GIotcnPVK_xOjXoH3Mlfhvl1kYCyfFL8sZ7DyaYgP22MsF8LkRgO6lzHP3QHHP2gJU7m9j7FWOb3gETx7XSldVQncpvGFd4n8k0k_94Q'

class ChatApp {
    constructor() {
        this.messageTextarea = document.getElementById('messageTextarea')
        this.messageFeed = document.getElementById('messageFeed')
        this.sendButton = document.getElementById('send')
        this.loginForm = document.getElementById('login')
        this.conversationList = document.getElementById('conversations')
        this.leaveButton = document.getElementById('leave')
        this.audio = document.getElementById('audio')
        this.enableButton = document.getElementById('enable')
        this.disableButton = document.getElementById('disable')
        this.callForm = document.getElementById('call-form')
        this.callControls = document.getElementById('call-controls')
        this.hangUpButton = document.getElementById('hang-up')
        this.callMembers = document.getElementById('call-members')
        this.setupUserEvents()
    }
    errorLogger(error) {
        console.log(error)
    }
    eventLogger(event) {
        return () => {
            console.log("'%s' event was sent", event)
        }
    }
    memberEventHandler(type) {
        return (member, event) => {
            const date = new Date(Date.parse(event.timestamp))
            console.log(`*** ${member.user.name} ${type} the conversation`)
            const text = `${member.user.name} @ ${date}: <b>${type} the conversation</b><br>`
            this.messageFeed.innerHTML = text + this.messageFeed.innerHTML
        }
    }

    setupAudioStream(stream) {
        // Older browsers may not have srcObject
        if ("srcObject" in this.audio) {
            this.audio.srcObject = stream;
        } else {
            // Avoid using this in new browsers, as it is going away.
            this.audio.src = window.URL.createObjectURL(stream);
        }

        this.audio.onloadedmetadata = () => {
            this.audio.play();
        }
    }

    showCallControls(member) {
        this.callControls.style.display = "block"
        this.callMembers.textContent = this.callMembers.textContent + " " + member.invited_by || member.user.name
    }
    authenticate(username) {
        return username.toLowerCase() === "juanma" ? USER_JWT : SECOND_USER_JWT
    }
    showConversationHistory(conversation) {
        conversation.getEvents().then((events) => {
            var eventsHistory = ""

            events.forEach((value, key) => {
                if (conversation.members[value.from]) {
                    const date = new Date(Date.parse(value.timestamp))
                    switch (value.type) {
                        case 'text:seen':
                            break;
                        case 'text:delivered':
                            break;
                        case 'text':
                            eventsHistory = `${conversation.members[value.from].user.name} @ ${date}: <b>${value.body.text}</b><br>` + eventsHistory
                            break;
                        case 'member:joined':
                            eventsHistory = `${conversation.members[value.from].user.name} @ ${date}: <b>joined the conversation</b><br>` + eventsHistory
                            break;
                        case 'member:left':
                            eventsHistory = `${conversation.members[value.from].user.name} @ ${date}: <b>left the conversation</b><br>` + eventsHistory
                            break;
                        case 'member:invited':
                            eventsHistory = `${conversation.members[value.from].user.name} @ ${date}: <b>invited to the conversation</b><br>` + eventsHistory
                            break;
                        case 'member:media':
                            eventsHistory = `${conversation.members[value.from].user.name} @ ${date}: <b>${value.body.audio ? "enabled" : "disabled"} audio</b><br>` + eventsHistory
                            break;
                        default:
                            eventsHistory = `${conversation.members[value.from].user.name} @ ${date}: <b>unknown event</b><br>` + eventsHistory
                    }
                }
            })
            this.messageFeed.innerHTML = eventsHistory + this.messageFeed.innerHTML
        })
    }
    setupConversationEvents(conversation) {
        this.conversation = conversation
        this.conversationList.style.display = 'none'
        document.getElementById("messages").style.display = "block"
        console.log('*** Conversation Retrieved', conversation)
        console.log('*** Conversation Member', conversation.me)
        // Bind to events on the conversation
        conversation.on('text', (sender, message) => {
            console.log('*** Message received', sender, message)
            const date = new Date(Date.parse(message.timestamp))
            const text = `${sender.user.name} @ ${date}: <b>${message.body.text}</b><br>`
            this.messageFeed.innerHTML = text + this.messageFeed.innerHTML
            if (sender.user.name !== this.conversation.me.user.name) {
                message.seen().then(this.eventLogger('text:seen')).catch(this.errorLogger)
            }
        })
        conversation.on("member:joined", this.memberEventHandler('joined'))
        conversation.on("member:left", this.memberEventHandler('left'))
        conversation.on("text:seen", (data, text) => console.log(`${data.user.name} saw text: ${text.body.text}`))
        conversation.on("text:typing:off", data => console.log(`${data.user.name} stopped typing...`))
        conversation.on("text:typing:on", data => console.log(`${data.user.name} started typing...`))
        conversation.on("member:media", (member, event) => {
            console.log(`*** Member changed media state`, member, event)
            const text = `${member.user.name} <b>${event.body.audio ? 'enabled' : 'disabled'} audio in the conversation</b><br>`
            this.messageFeed.innerHTML = text + this.messageFeed.innerHTML
        })

        this.showConversationHistory(conversation)
    }
    updateConversationsList(conversations) {
        let conversationsElement = document.createElement("ul")
        for (let id in conversations) {
            let conversationElement = document.createElement("li")
            conversationElement.textContent = conversations[id].display_name
            conversationElement.addEventListener("click", () => this.setupConversationEvents(conversations[id]))
            conversationsElement.appendChild(conversationElement)
        }
        if (!conversationsElement.childNodes.length) {
            conversationsElement.textContent = "You are not a member of any conversations"
        }
        this.conversationList.appendChild(conversationsElement)
        this.conversationList.style.display = 'block'
        this.loginForm.style.display = 'none'
    }
    listConversations(userToken) {
        new ConversationClient({
            debug: false
        })
            .login(userToken)
            .then(app => {
                console.log('*** Logged into app', app)

                this.app = app

                app.on("member:call", (member, call) => {
                    if (window.confirm(`Incoming call from ${member.user.name}. Do you want to answer?`)) {
                        this.call = call
                        call.answer().then((stream) => {
                            this.setupAudioStream(stream)
                            this.showCallControls(member)
                        })
                    } else {
                        call.hangUp()
                    }
                })

                app.on("member:invited", (member, event) => {
                    //identify the sender.
                    console.log("*** Invitation received:", event);
                    //accept an invitation.
                    app.getConversation(event.cid || event.body.cname)
                        .then((conversation) => {
                            this.conversation = conversation
                            conversation.join().then(() => {
                                var conversationDictionary = {}
                                conversationDictionary[this.conversation.id] = this.conversation
                                this.updateConversationsList(conversationDictionary)
                            }).catch(this.errorLogger)
                        })
                        .catch(this.errorLogger)
                })
                return app.getConversations()
            })
            .then((conversations) => {
                console.log('*** Retrieved conversations', conversations)
                this.updateConversationsList(conversations)
            })
            .catch(this.errorLogger)
    }
    setupUserEvents() {
        this.sendButton.addEventListener('click', () => {
            this.conversation.sendText(this.messageTextarea.value).then(() => {
                this.eventLogger('text')()
                this.messageTextarea.value = ''
            }).catch(this.errorLogger)
        })
        this.loginForm.addEventListener('submit', (event) => {
            event.preventDefault()
            const userToken = this.authenticate(this.loginForm.children.username.value)
            if (userToken) {
                this.listConversations(userToken)
            }
        })
        this.messageTextarea.addEventListener('focus', () => {
            this.conversation.startTyping().then(this.eventLogger('text:typing:on')).catch(this.errorLogger)
        });
        this.messageTextarea.addEventListener('blur', () => {
            this.conversation.stopTyping().then(this.eventLogger('text:typing:off')).catch(this.errorLogger)
        })
        this.leaveButton.addEventListener('click', () => {
            this.conversation.leave().then(this.eventLogger('member:left')).catch(this.errorLogger)
        })
        this.enableButton.addEventListener('click', () => {
            this.conversation.media.enable().then(stream => {
                this.setupAudioStream(stream)
                this.eventLogger('member:media')()
            }).catch(this.errorLogger)
        })
        this.disableButton.addEventListener('click', () => {
            this.conversation.media.disable().then(this.eventLogger('member:media')).catch(this.errorLogger)
        })
        this.callForm.addEventListener('submit', (event) => {
            event.preventDefault()
            var usernames = this.callForm.children.username.value.split(",").map(username => username.trim())

            this.app.call(usernames).then(call => {
                this.setupAudioStream(call.application.activeStream.stream)
                this.call = call

                call.on("call:member:state", (from, state, event) => {
                    if (state = "ANSWERED") {
                        this.showCallControls(from)
                    }
                    console.log("member: " + from.user.name + " has " + state);
                });
            });
        })
        this.hangUpButton.addEventListener('click', () => {
            this.call.hangUp()
            this.callControls.style.display = "none"
        })
    }
}
new ChatApp()