import "@/components/_Layout/Footer.css"

export default function Footer() {

    return (
        <div id="footer-body">
            <div className="item-slot en-font">
                {
                    `All assets © Kuro Games 2024
                    Non-Official fan project. By SSeries
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