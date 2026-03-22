import { useEffect, useState } from "react";
import "./App.css";
import { FaPlus, FaMinus } from "react-icons/fa";
import mascote1 from "./assets/mascote1.png";
import mascote2 from "./assets/mascote2.png";
import mascote3 from "./assets/mascote3.png";

function App() {
  const [placarA, setPlacarA] = useState(0);
  const [placarB, setPlacarB] = useState(0);
  const [setsA, setSetsA] = useState(0);
  const [setsB, setSetsB] = useState(0);
  const [melhorDe, setMelhorDe] = useState(3);
  const [animandoA, setAnimandoA] = useState(false);
  const [animandoB, setAnimandoB] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [bloqueado, setBloqueado] = useState(false);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("placarVolei"));
    if (dados) {
      setPlacarA(dados.placarA);
      setPlacarB(dados.placarB);
      setSetsA(dados.setsA);
      setSetsB(dados.setsB);
      setMelhorDe(dados.melhorDe);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "placarVolei",
      JSON.stringify({ placarA, placarB, setsA, setsB, melhorDe })
    );
  }, [placarA, placarB, setsA, setsB, melhorDe]);

  const setsParaVencer = Math.ceil(melhorDe / 2);
  const setAtual = setsA + setsB + 1;
  const pontosParaVencer = setAtual === melhorDe ? 15 : 25;

  const animar = (setFunc) => {
    setFunc(true);
    setTimeout(() => setFunc(false), 300);
    if ("vibrate" in navigator) navigator.vibrate(80);
  };

  const marcarPonto = (time) => {
    if (mensagem || bloqueado) return;
    if (time === "A") {
      const novo = placarA + 1;
      setPlacarA(novo);
      animar(setAnimandoA);
      verificarVencedorSet(novo, placarB, "A");
    } else {
      const novo = placarB + 1;
      setPlacarB(novo);
      animar(setAnimandoB);
      verificarVencedorSet(placarA, novo, "B");
    }
  };

  const retirarPonto = (time) => {
    if (mensagem || bloqueado) return;
    if (time === "A") setPlacarA(Math.max(0, placarA - 1));
    else setPlacarB(Math.max(0, placarB - 1));
  };

  const verificarVencedorSet = (a, b, ultimo) => {
    const diff = Math.abs(a - b);
    if (a >= pontosParaVencer && a > b && diff >= 2) {
      setSetsA((s) => s + 1);
      encerrarSet("A");
    } else if (b >= pontosParaVencer && b > a && diff >= 2) {
      setSetsB((s) => s + 1);
      encerrarSet("B");
    }
  };

  const encerrarSet = (vencedor) => {
    setBloqueado(true);
    setTimeout(() => {
      setPlacarA(0);
      setPlacarB(0);
      setBloqueado(false);

      if (setsA + 1 === setsParaVencer && vencedor === "A") {
        setMensagem("TIME A CAMPEÃO!");
      } else if (setsB + 1 === setsParaVencer && vencedor === "B") {
        setMensagem("TIME B CAMPEÃO!");
      }
    }, 2000);
  };

  const resetarPlacar = () => {
    setPlacarA(0);
    setPlacarB(0);
    setSetsA(0);
    setSetsB(0);
    setMensagem("");
    setBloqueado(false);
  };

  const renderSetsBadges = (setsWin, totalSets) => {
    const badges = [];
    for (let i = 1; i <= totalSets; i++) {
      badges.push(
        <span
          key={i}
          className={`set-badge ${i <= setsWin ? "won" : ""}`}
        >
          {i <= setsWin ? "✓" : i}
        </span>
      );
    }
    return badges;
  };

  return (
    <main className="app">
      <div className="mascotes-fundo">
        <img src={mascote1} alt="Mascote" className="mascote mascote1" />
        <img src={mascote2} alt="Mascote" className="mascote mascote2" />
        <img src={mascote3} alt="Mascote" className="mascote mascote3" />
      </div>

      <header className="header">
        <h1>PLACAR DE VÔLEI</h1>
        <div className="header-meta">
          <div className="set-indicator">
            Set <span className="set-number">{setAtual}</span> de {melhorDe}
          </div>
          <div className="modo">
            <span>Melhor de:</span>
            <select
              value={melhorDe}
              onChange={(e) => setMelhorDe(Number(e.target.value))}
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
            </select>
          </div>
        </div>
      </header>

      <section className="placar">
        <div className="time">
          <h2>Time A</h2>
          <p className={`pontos ${animandoA ? "animar" : ""}`}>{placarA}</p>
          <div className="botoes">
            <button onClick={() => marcarPonto("A")}>
              <FaPlus />
            </button>
            <button onClick={() => retirarPonto("A")}>
              <FaMinus />
            </button>
          </div>
          <div className="sets-container">
            <span className="sets-label">Sets</span>
            <div className="sets-badges">
              {renderSetsBadges(setsA, setsParaVencer)}
            </div>
          </div>
        </div>

        <div className="separador">
          VS
          <span>Placar</span>
        </div>

        <div className="time">
          <h2>Time B</h2>
          <p className={`pontos ${animandoB ? "animar" : ""}`}>{placarB}</p>
          <div className="botoes">
            <button onClick={() => marcarPonto("B")}>
              <FaPlus />
            </button>
            <button onClick={() => retirarPonto("B")}>
              <FaMinus />
            </button>
          </div>
          <div className="sets-container">
            <span className="sets-label">Sets</span>
            <div className="sets-badges">
              {renderSetsBadges(setsB, setsParaVencer)}
            </div>
          </div>
        </div>
      </section>

      {mensagem && <div className="mensagem">{mensagem}</div>}

      <button className="reset" onClick={resetarPlacar}>
        Novo Jogo
      </button>
    </main>
  );
}

export default App;
