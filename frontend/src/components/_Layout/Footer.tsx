import "@/components/_Layout/Footer.css"

const FOOTER_TEXT = `Contact: SSeries000923@gmail.com\nWuthering Waves and all related assets are © Kuro Games.\nThis website is an unofficial fan project and is not affiliated with Kuro Games.`

export default function Footer() {

    return (
        <div id="footer-body">
            <div className="item-slot en-font">{FOOTER_TEXT}</div>
            <div className="item-slot">
                <a target="blank" href="https://ko-fi.com/sseries">
                    <img className="footer-icon"
                        alt="title"
                        src="/kofi.png" />
                </a>
                <a target="blank" href="https://github.com/S-Series">
                    <img className="footer-icon"
                        alt="title"
                        src="/github.png" />
                </a>
                <a target="blank" href="https://sseries.dev">
                    <img className="footer-icon"
                        alt="title"
                        src="/sseries.png" />
                </a>
            </div>
        </div>
    )
}
