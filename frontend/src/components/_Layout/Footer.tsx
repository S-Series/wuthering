import "@/components/_Layout/Footer.css"

export default function Footer() {

    return (
        <div id="footer-body">
            <div className="item-slot en-font">
                {
                    `Wuthering Waves and all related assets are © Kuro Games.
This website is an unofficial fan project and is not affiliated with Kuro Games.
Contact: SSeries000923@gmail.com`
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