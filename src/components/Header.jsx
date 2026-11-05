export default function Header({ college }) {
  return (
    <header className="nl-header">
      <div className="nl-header-rule" />
      <div className="nl-header-main">
        <img src={college.logo} alt="College logo" className="nl-logo" />
        <div className="nl-brand">
          <p className="nl-trust">{college.trustMr}</p>
          <h1 className="nl-name-mr">{college.nameMr}</h1>
          <p className="nl-name-mr-sub">{college.nameMrSub}</p>
          <p className="nl-name-en">{college.nameEn}</p>
          <p className="nl-name-en-sub">{college.nameEnSub}</p>
        </div>
      </div>
      <div className="nl-header-rule nl-header-rule-thin" />
      <p className="nl-kicker">{college.headerNote}</p>
    </header>
  );
}