import { casa } from "../data/casa";
import { IcInsta, IcMoto, IcPin, IcSeta } from "../components/chrome/icons";
import "./screens.css";

export function Footer() {
  return (
    <footer className="casa" id="casa" aria-label="Informações da casa">
      <div className="checker checker--thin" />
      <div className="casa__inner wrap">
        <img className="casa__logo" src="/brand/logo-256.webp" alt="Logo do Bar Mamadi" width="140" height="140" loading="lazy" />
        <div className="casa__cards">
          <a className="info" href={casa.mapsUrl} target="_blank" rel="noreferrer">
            <IcPin className="info__icon" />
            <span className="info__body">
              <span className="info__label">Endereço</span>
              <strong>{casa.endereco}</strong>
              <span>{casa.bairro}</span>
              <span>
                {casa.cidade} · CEP {casa.cep}
              </span>
            </span>
            <span className="info__cta">
              Como chegar <IcSeta />
            </span>
          </a>

          <a className="info" href={casa.instagramUrl} target="_blank" rel="noreferrer">
            <IcInsta className="info__icon" />
            <span className="info__body">
              <span className="info__label">Instagram</span>
              <strong>@{casa.instagram}</strong>
              <span>Promoções, eventos e as novidades da casa.</span>
            </span>
            <span className="info__cta">
              Seguir <IcSeta />
            </span>
          </a>

          <a className="info" href={casa.ifoodUrl} target="_blank" rel="noreferrer">
            <IcMoto className="info__icon" />
            <span className="info__body">
              <span className="info__label">Em casa</span>
              <strong>Peça pelo iFood</strong>
              <span>A comida da Mamadi também vai até você.</span>
            </span>
            <span className="info__cta">
              Pedir <IcSeta />
            </span>
          </a>
        </div>
        <p className="casa__fine">Preços em reais. Beba com moderação: venda proibida para menores de 18 anos.</p>
      </div>
    </footer>
  );
}
