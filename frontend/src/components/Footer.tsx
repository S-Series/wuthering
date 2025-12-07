import { useAppStore } from "@/hooks/appStore";
import "./Footer.css";

export default function Footer() {

    //const { lang, setLang } = useAppStore();

    return (
        <div id="footer-body">
            <div className="item-slot en-font">
                {
                    `All assets © Kuro Games 2024 || non-official fan project
                    E-mail: SSeries000923@gmail.com || Discord: SSeries0923`
                }
            </div>
            <div className="item-slot">
                <a href="#">
                    <img className="footer-icon"
                        alt="title"
                        src="/kofi.png" />
                </a>
                <a href="#">
                    <img className="footer-icon"
                        alt="title"
                        src="/github.png" />
                </a>
                <a href="#">
                    <img className="footer-icon"
                        alt="title"
                        src="/sseries.png" />
                </a>
            </div>
        </div>
    )
}