import { useEffect, useState } from "react";
import "./App.css";
import { FaPlus, FaMinus } from "react-icons/fa";
import mascote1 from "./assets/mascote1.png"; // chimarrão
import mascote2 from "./assets/mascote2.png"; // esquerda
import mascote3 from "./assets/mascote3.png"; // direita

function App() {
  const [placarA, setPlacarA] = useState(0);
  const [placarB, setPlacarB] = useState(0);
  const [setsA, setSetsA] = useState(0);
  const [setsB, setSetsB] = useState(0);
  const [melhorDe, setMelhorDe] = useState(3);
  const [animandoA, setAnimandoA] = useState(false);
  const [animandoB, setAnimandoB] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [bloqueado, setBloqueado] = useState(false); // NOVO: bloqueia cliques pós-set

  // === carregar do localStorage ===
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

  // === salvar no localStorage ===
  useEffect(() => {
    localStorage.setItem(
      "placarVolei",
      JSON.stringify({ placarA, placarB, setsA, setsB, melhorDe })
    );
  }, [placarA, placarB, setsA, setsB, melhorDe]);

  const setsParaVencer = Math.ceil(melhorDe / 2);
  const setAtual = setsA + setsB + 1;
  const pontosParaVencer = setAtual === melhorDe ? 15 : 25;

  // === animação e vibração ===
  const animar = (setFunc) => {
    setFunc(true);
    setTimeout(() => setFunc(false), 300);
    if ("vibrate" in navigator) navigator.vibrate(80);
  };

  // === marcar ponto ===
  const marcarPonto = (time) => {
    if (mensagem || bloqueado) return; // NOVO: trava ao finalizar set
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
    if (mensagem || bloqueado) return; // NOVO
    if (time === "A") setPlacarA(Math.max(0, placarA - 1));
    else setPlacarB(Math.max(0, placarB - 1));
  };

  // === verificar vencedor de set ===
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
    setBloqueado(true); // NOVO: impede interações
    setTimeout(() => {
      setPlacarA(0);
      setPlacarB(0);
      setBloqueado(false); // NOVO: libera após delay

      // verificar se o jogo terminou
      if (setsA + 1 === setsParaVencer && vencedor === "A") {
        setMensagem("🏆 Time A venceu o jogo!");
      } else if (setsB + 1 === setsParaVencer && vencedor === "B") {
        setMensagem("🏆 Time B venceu o jogo!");
      }
    }, 2000); // NOVO: delay de 2 segundos
  };

  const resetarPlacar = () => {
    setPlacarA(0);
    setPlacarB(0);
    setSetsA(0);
    setSetsB(0);
    setMensagem("");
    setBloqueado(false);
  };

  return (
    <main className="app">
      <div className="mascotes-fundo">
        <img src={mascote1} alt="Mascote chimarrão" className="mascote mascote1" />
        <img src={mascote2} alt="Mascote esquerda" className="mascote mascote2" />
        <img src={mascote3} alt="Mascote direita" className="mascote mascote3" />
      </div>

      <header className="header">
        <h1>🏐 Placar de Vôlei</h1>

        <div className="modo">
          <span>Modo:</span>
          <select
            value={melhorDe}
            onChange={(e) => setMelhorDe(Number(e.target.value))}
          >
            <option value={3}>Melhor de 3</option>
            <option value={5}>Melhor de 5</option>
          </select>
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
          <p className="sets">Sets: {setsA}</p>
        </div>

        <div className="separador">x</div>

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
          <p className="sets">Sets: {setsB}</p>
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
