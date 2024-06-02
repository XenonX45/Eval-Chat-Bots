export const chat = () => {
    return `
    <div class="col s9 chat-section">
        <div class="chat-window" id="chat-window"></div>
        <div class="input-section">
            <input type="text" id="user-input" placeholder="Type your message here..." class="input-field">
            <button class="btn" id="send-button">Send</button>
        </div>
    </div>
    `;
}