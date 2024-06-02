import { chat } from "../Components/chat"
import { sidebar } from "../Components/sidebar";

export const home = () => {
    const homePage = `
        <div class="container">
            <div class="row">
                ${sidebar()}
                ${chat()}
            </div>
        </div>
    `;

    return homePage;
}