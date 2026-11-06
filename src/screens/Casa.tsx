import { casa } from "../data/casa";
import { Cadeira } from "../components/art/Decor";
import { IcInsta, IcMoto, IcPin, IcRelogio, IcSeta } from "../components/chrome/icons";
import { kitchenStatus } from "../lib/schedule";
import "./screens.css";

export function Casa() {
  const k = kitchenStatus();
  return (
    <div className="casa">
      <header className="casa__hero">
        <img className="casa__logo" src="/brand/logo-512.webp" alt="Logo do Bar Mamadi" width="200" height="200" />
        <h1 className="letreiro casa__title">A casa</h1>
        <p className="hand casa__note">{casa.slogan}</p>
      </header>

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

        <div className="info">
          <IcRelogio className="info__icon" />
          <span className="info__body">
            <span className="info__label">Comidinhas caseiras</span>
            <strong>{casa.comidinhas}</strong>
            <span>Churrasco no sábado e no domingo. Baião de dois todo domingo.</span>
            <span className={`kitchen${k.open ? " is-open" : ""}`}>
              <span className="kitchen__dot" aria-hidden="true" />
              {k.label}
            </span>
          </span>
        </div>

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

      <section className="manifesto">
        <Cadeira className="manifesto__chair" />
        <p className="manifesto__text">
          Bar LGBTQIA+ em frente à Praça Roosevelt, desde {casa.desde}. Aqui tem cadeira pra todo mundo, litrão gelado e comida de mãe.
        </p>
        <span className="manifesto__flag" aria-hidden="true" />
      </section>

      <p className="casa__fine">
        Preços em reais. Beba com moderação: venda proibida para menores de 18 anos.
      </p>
    </div>
  );
}
