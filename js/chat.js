// Konfigurasi URL Apps Script Anda
const GAS_CHAT_URL = "https://script.google.com/macros/s/AKfycbzvefvpeMRw4un75BA01C3HMlP-GMdKhCgG_u1HXannrBnXUSoSrvbBK8cvbB3TgSN0KA/exec";

document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const quickReplies = document.querySelectorAll('.quick-reply-btn');

    // Handle Quick Replies
    quickReplies.forEach(btn => {
        btn.addEventListener('click', () => {
            chatInput.value = btn.textContent;
            chatForm.dispatchEvent(new Event('submit')); // Trigger submit event
        });
    });

    function formatMarkdown(text) {
        return text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\*(.*?)\*/g, '<i>$1</i>').replace(/\n/g, '<br>');
    }

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-2xl border-[3px] border-black text-sm md:text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] leading-relaxed ${
            sender === 'user' ? 'self-end bg-neo-green text-black rounded-tr-none' : 'self-start bg-white dark:bg-slate-800 dark:text-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] rounded-tl-none'
        }`;
        msgDiv.innerHTML = formatMarkdown(text);
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const message = chatInput.value.trim();
            if (!message) return;

            appendMessage('user', message);
            chatInput.value = '';

            const loadingId = 'loading-' + Date.now();
            const loadingDiv = document.createElement('div');
            loadingDiv.id = loadingId;
            loadingDiv.className = `self-start max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-2xl rounded-tl-none border-[3px] border-black bg-neo-yellow text-black text-sm md:text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex gap-2 items-center`;
            loadingDiv.innerHTML = `<div class="w-2 h-2 bg-black rounded-full animate-bounce"></div><div class="w-2 h-2 bg-black rounded-full animate-bounce" style="animation-delay: 0.1s"></div><div class="w-2 h-2 bg-black rounded-full animate-bounce" style="animation-delay: 0.2s"></div>`;
            chatMessages.appendChild(loadingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            if (GAS_CHAT_URL === "MASUKKAN_URL_WEB_APP_ANDA_DISINI") {
                document.getElementById(loadingId).remove();
                appendMessage('ai', 'Sistem belum terhubung! Harap masukkan URL Web App Apps Script ke dalam file chat.js');
                return;
            }

            fetch(GAS_CHAT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'message': message
                })
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById(loadingId).remove();
                if(data && data.reply) {
                    appendMessage('ai', data.reply);
                } else {
                    appendMessage('ai', 'Maaf, Admin Luminous sedang mengalami gangguan sistem.');
                }
            })
            .catch(error => {
                console.error("Error:", error);
                document.getElementById(loadingId).remove();
                appendMessage('ai', 'Gagal terhubung ke server. Periksa koneksi internet Anda.');
            });
        });
    }
});
