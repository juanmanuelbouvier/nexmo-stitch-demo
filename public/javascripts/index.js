const USER_JWT = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1Mjk1OTM4NjYsImp0aSI6IjUyNTRiNTcwLTc1NjUtMTFlOC1iODk3LTUzZDdiMjEyZmIxNCIsInN1YiI6InB1bWEiLCJleHAiOiIxNTI5NjgwMjY2IiwiYWNsIjp7InBhdGhzIjp7Ii92MS91c2Vycy8qKiI6e30sIi92MS9jb252ZXJzYXRpb25zLyoqIjp7fSwiL3YxL3Nlc3Npb25zLyoqIjp7fSwiL3YxL2RldmljZXMvKioiOnt9LCIvdjEvaW1hZ2UvKioiOnt9LCIvdjMvbWVkaWEvKioiOnt9LCIvdjEvYXBwbGljYXRpb25zLyoqIjp7fSwiL3YxL3B1c2gvKioiOnt9LCIvdjEva25vY2tpbmcvKioiOnt9fX0sImFwcGxpY2F0aW9uX2lkIjoiMmVmYzlmNTQtMjE5OC00MGY2LWJmNGMtOGZmYTY1N2Y3NjNkIn0.RghfSnL0qQLaeB5R-uSeDDUdxonV6VQnyw9AOdFkCfwqny8MiUYYksJkzn4OlkWTaAArL6XtI2HZmzhUz3N1DnCsIXXx3dZj1Txfa4U9gAayJeUSOxBMtM_b_KR3uVvzNGYNDXgv_hd2nG_OiB3NoJ-Xn5l2FggPvZRWqqQd8ZCgNuymorhtjryGDPVME2Q0msKasBX3sGGZJOAvcXornvimTZwaOLrrM51HHcc9qt6EjLAlMqtVszpsLeqjnnAgXo-D5QyR1BJlOY3TRxziSThcNlMyoKZtXkQLM6z-rBuwf_R5KqYLF4kXBjo1j_h6fvDzdmpufE2orB4uYwbP8Q'
const SECOND_USER_JWT = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1Mjk1OTQwODQsImp0aSI6ImQ0NTA5ZTQwLTc1NjUtMTFlOC1iZWFkLTk5ZmNjN2NiOGM5MiIsInN1YiI6ImVtaSIsImV4cCI6IjE1Mjk2ODA0ODQiLCJhY2wiOnsicGF0aHMiOnsiL3YxL3VzZXJzLyoqIjp7fSwiL3YxL2NvbnZlcnNhdGlvbnMvKioiOnt9LCIvdjEvc2Vzc2lvbnMvKioiOnt9LCIvdjEvZGV2aWNlcy8qKiI6e30sIi92MS9pbWFnZS8qKiI6e30sIi92My9tZWRpYS8qKiI6e30sIi92MS9hcHBsaWNhdGlvbnMvKioiOnt9LCIvdjEvcHVzaC8qKiI6e30sIi92MS9rbm9ja2luZy8qKiI6e319fSwiYXBwbGljYXRpb25faWQiOiIyZWZjOWY1NC0yMTk4LTQwZjYtYmY0Yy04ZmZhNjU3Zjc2M2QifQ.skUii0GM5l1NPELDzy0MJX9C5bahQ1myi3mzkSY1Vm8qUQKLni46v_WJLDtHR0Q9B3jUh7Ye_eP12aZT2AOKJhuSRzJvfLZ3mfRLO_iW43_6cmyMJZOOExcba4AYHkgPqkdxxrE7O3l-8mZQ5dTOYu2reOkNxERCswADbw-sG2cgJ2yl7GhbKJcuhqFN5apxAoE4gRaJ0urBJZ78siwsC_a6Ng9CE02PKjOZBFFQoHes3hutX0dxRUQniez2zCN_T-5WgbkH-JVrRJaKUSRtb2ydtVIYLKJil53y_N3gFU92Fr643d9kuOWV3bS3WdGTaLM6URUpAeABl2vUCoxVoA'

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
        return username.toLowerCase() === "puma" ? USER_JWT : SECOND_USER_JWT
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
                    if (window.confirm(`Incoming call from ${member.invited_by}. Do you want to answer?`)) {
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