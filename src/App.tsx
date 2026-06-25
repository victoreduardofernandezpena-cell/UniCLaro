import { useEffect, useMemo, useState } from "react";
import type { Dispatch, FormEvent, ReactNode, SetStateAction } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import {
  AlertTriangle,
  BookOpenCheck,
  CalendarClock,
  Check,
  ClipboardList,
  GraduationCap,
  Menu,
  Plus,
  Trash2,
  X,
} from "lucide-react";

type Setter<T> = Dispatch<SetStateAction<T>>;

type Evaluation = {
  id: string;
  name: string;
  maxPoints: string;
  earnedPoints: string;
  status: "completada" | "pendiente";
};

type Subject = {
  id: string;
  name: string;
  credits: string;
  grade: string;
};

type AbsenceSubject = {
  id: string;
  name: string;
  hoursPerClass: string;
  classesPerWeek: string;
  absences: string;
  limit: string;
};

type Task = {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: "baja" | "media" | "alta";
  status: "pendiente" | "en progreso" | "completada";
  note: string;
};

const tools = [
  {
    title: "Calculadora de nota final",
    navLabel: "Nota final",
    text: "Calcula tu acumulado por puntos y cuánto necesitas en lo pendiente.",
    to: "/calculadora-nota-final",
    icon: BookOpenCheck,
  },
  {
    title: "Calculadora de índice académico",
    navLabel: "Índice",
    text: "Estima tu promedio ponderado usando créditos y notas.",
    to: "/calculadora-indice-academico",
    icon: GraduationCap,
  },
  {
    title: "Control de faltas",
    navLabel: "Faltas",
    text: "Registra faltas por materia y revisa tu nivel de riesgo.",
    to: "/control-de-faltas",
    icon: AlertTriangle,
  },
  {
    title: "Planificador de estudio",
    navLabel: "Planificador",
    text: "Genera un plan diario hasta la fecha de tu examen.",
    to: "/planificador-estudio",
    icon: CalendarClock,
  },
  {
    title: "Organizador de tareas",
    navLabel: "Tareas",
    text: "Ordena tareas por estado, prioridad y fecha de entrega.",
    to: "/tareas",
    icon: ClipboardList,
  },
];

function uid() {
  return crypto.randomUUID();
}

function number(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function fmt(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "0";
  return value.toFixed(digits).replace(/\.?0+$/, "");
}

function useTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

function useLocalStorage<T>(key: string, initialValue: T): [T, Setter<T>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app">
      <header className="header">
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <span className="brandIcon">
            <GraduationCap size={22} />
          </span>
          <span>UniClaro</span>
        </Link>

        <button
          className="iconButton mobileOnly"
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={menuOpen ? "nav open" : "nav"}>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            Inicio
          </NavLink>
          {tools.map((tool) => (
            <NavLink key={tool.to} to={tool.to} onClick={() => setMenuOpen(false)}>
              {tool.navLabel}
            </NavLink>
          ))}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculadora-nota-final" element={<FinalGrade />} />
          <Route path="/calculadora-indice-academico" element={<AcademicIndex />} />
          <Route path="/control-de-faltas" element={<AbsenceControl />} />
          <Route path="/planificador-estudio" element={<StudyPlanner />} />
          <Route path="/tareas" element={<Tasks />} />
        </Routes>
      </main>

      <footer className="footer">
        <strong>UniClaro</strong>
        <span>Organiza tu universidad sin enredarte.</span>
      </footer>
    </div>
  );
}

function Home() {
  useTitle("UniClaro | Herramientas universitarias");

  return (
    <>
      <section className="hero">
        <div className="heroText">
          <p className="eyebrow">Herramientas universitarias</p>
          <h1>UniClaro</h1>
          <p className="tagline">Organiza tu universidad sin enredarte.</p>
          <p className="lead">
            Calcula tus notas, controla tus faltas, organiza tus tareas y planifica tus exámenes desde un solo lugar.
          </p>
          <div className="heroActions">
            <Link className="button primary" to="/calculadora-nota-final">
              Calcular nota
            </Link>
            <Link className="button secondary" to="/control-de-faltas">
              Controlar faltas
            </Link>
            <Link className="button soft" to="/tareas">
              Organizar tareas
            </Link>
          </div>
        </div>

        <div className="heroPreview">
          <div className="previewCard">
            <span>Nota acumulada</span>
            <strong>84.5</strong>
          </div>
          <div className="previewCard mint">
            <span>Tareas pendientes</span>
            <strong>5</strong>
          </div>
          <div className="previewCard warning">
            <span>Faltas restantes</span>
            <strong>3</strong>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="sectionTitle">
          <p className="eyebrow">MVP</p>
          <h2>Herramientas rápidas para tu semestre</h2>
        </div>
        <ToolGrid />
      </section>
    </>
  );
}

function ToolGrid() {
  return (
    <div className="toolGrid">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <article className="card toolCard" key={tool.to}>
            <span className="toolIcon">
              <Icon size={24} />
            </span>
            <h3>{tool.title}</h3>
            <p>{tool.text}</p>
            <Link className="button small" to={tool.to}>
              Usar herramienta
            </Link>
          </article>
        );
      })}
    </div>
  );
}

function ToolPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="page">
      <div className="pageTitle">
        <p className="eyebrow">UniClaro</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <AdSlot />
      <div className="workspace">{children}</div>
      <AdSlot />
    </section>
  );
}

function AdSlot() {
  return <div className="adSlot">Espacio para anuncio futuro</div>;
}

function FinalGrade() {
  useTitle("Calculadora de nota final | UniClaro");
  const [evaluations, setEvaluations] = useState<Evaluation[]>([
    { id: uid(), name: "Parcial 1", maxPoints: "25", earnedPoints: "21", status: "completada" },
    { id: uid(), name: "Prácticas", maxPoints: "20", earnedPoints: "18", status: "completada" },
    { id: uid(), name: "Examen final", maxPoints: "55", earnedPoints: "", status: "pendiente" },
  ]);
  const [desired, setDesired] = useState("80");
  const [finalTotal, setFinalTotal] = useState("100");

  const result = useMemo(() => {
    const totalFinal = number(finalTotal);
    const totalPossible = evaluations.reduce((sum, item) => sum + number(item.maxPoints), 0);
    const completed = evaluations.filter((item) => item.status === "completada");
    const evaluatedPoints = completed.reduce((sum, item) => sum + number(item.maxPoints), 0);
    const accumulated = completed.reduce((sum, item) => sum + number(item.earnedPoints), 0);
    const pendingPoints = Math.max(0, totalFinal - evaluatedPoints);
    const needed = number(desired) - accumulated;
    const errors: string[] = [];

    if (totalFinal <= 0) errors.push("El total final debe ser mayor que 0 puntos.");
    if (totalPossible > totalFinal) errors.push("El total de puntos máximos no debe pasar del total final.");
    if (evaluations.some((item) => number(item.maxPoints) < 0 || number(item.earnedPoints) < 0)) {
      errors.push("Los puntos no pueden ser negativos.");
    }
    if (evaluations.some((item) => item.status === "completada" && number(item.earnedPoints) > number(item.maxPoints))) {
      errors.push("Los puntos obtenidos no pueden ser mayores que los puntos máximos.");
    }
    if (number(desired) < 0 || number(desired) > totalFinal) errors.push("La nota deseada debe estar entre 0 y el total final.");

    let message = "Completa tus datos para ver el resultado.";
    let tone: "good" | "warning" | "danger" = "good";
    if (!errors.length) {
      if (needed <= 0) message = "Ya alcanzaste la nota deseada.";
      else if (pendingPoints <= 0) {
        message = "Ya no tienes puntos pendientes suficientes para subir la nota.";
        tone = "danger";
      } else if (needed <= pendingPoints * 0.7) message = "Vas bien, todavía tienes margen.";
      else if (needed <= pendingPoints) {
        message = "Es posible, pero necesitas esforzarte.";
        tone = "warning";
      } else {
        message = "Está difícil, necesitas más puntos de los que quedan disponibles.";
        tone = "danger";
      }
    }

    return { totalPossible, evaluatedPoints, accumulated, pendingPoints, needed, errors, message, tone };
  }, [desired, evaluations, finalTotal]);

  function update(id: string, field: keyof Evaluation, value: string) {
    setEvaluations((items) => items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  return (
    <ToolPage
      title="Calculadora de nota final"
      description="Agrega evaluaciones por puntos y descubre cuánto llevas acumulado y qué necesitas sacar en lo pendiente."
    >
      <section className="card formCard">
        <div className="rowHeader">
          <h2>Evaluaciones</h2>
          <button className="button small" type="button" onClick={() => setEvaluations((items) => [...items, { id: uid(), name: "", maxPoints: "", earnedPoints: "", status: "pendiente" }])}>
            <Plus size={18} /> Agregar
          </button>
        </div>

        {evaluations.map((item) => (
          <div className="inputGrid gradeRow" key={item.id}>
            <label>
              Nombre de evaluación
              <input value={item.name} onChange={(event) => update(item.id, "name", event.target.value)} />
            </label>
            <label>
              Puntos máximos
              <input type="number" min="0" value={item.maxPoints} onChange={(event) => update(item.id, "maxPoints", event.target.value)} />
            </label>
            <label>
              Puntos obtenidos
              <input
                type="number"
                min="0"
                placeholder={item.status === "pendiente" ? "Pendiente" : "0"}
                disabled={item.status === "pendiente"}
                value={item.status === "pendiente" ? "" : item.earnedPoints}
                onChange={(event) => update(item.id, "earnedPoints", event.target.value)}
              />
            </label>
            <label>
              Estado
              <select
                value={item.status}
                onChange={(event) => {
                  const status = event.target.value as Evaluation["status"];
                  setEvaluations((items) =>
                    items.map((row) =>
                      row.id === item.id ? { ...row, status, earnedPoints: status === "pendiente" ? "" : row.earnedPoints } : row
                    )
                  );
                }}
              >
                <option value="completada">Completada</option>
                <option value="pendiente">Pendiente</option>
              </select>
            </label>
            <button className="iconButton danger" type="button" aria-label="Eliminar evaluación" onClick={() => setEvaluations((items) => items.filter((row) => row.id !== item.id))}>
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        <div className="inputGrid twoCols">
          <label>
            Nota deseada
            <input type="number" min="0" value={desired} onChange={(event) => setDesired(event.target.value)} />
          </label>
          <label>
            Total final
            <input type="number" min="1" value={finalTotal} onChange={(event) => setFinalTotal(event.target.value)} />
          </label>
        </div>
      </section>

      <ResultCard tone={result.tone} errors={result.errors}>
        <Metric label="Total de puntos posibles" value={`${fmt(result.totalPossible)} pts`} />
        <Metric label="Puntos ya evaluados" value={`${fmt(result.evaluatedPoints)} pts`} />
        <Metric label="Puntos acumulados" value={`${fmt(result.accumulated)} pts`} />
        <Metric label="Puntos pendientes" value={`${fmt(result.pendingPoints)} pts`} />
        <Metric label="Necesitas sacar en lo pendiente" value={`${fmt(Math.max(0, result.needed))} pts`} />
        <p className={`message ${result.tone}`}>{result.message}</p>
      </ResultCard>
    </ToolPage>
  );
}

function AcademicIndex() {
  useTitle("Calculadora de índice académico | UniClaro");
  const [subjects, setSubjects] = useState<Subject[]>([{ id: uid(), name: "Materia 1", credits: "3", grade: "90" }]);
  const [previousCredits, setPreviousCredits] = useState("0");
  const [previousIndex, setPreviousIndex] = useState("0");

  const result = useMemo(() => {
    const valid = subjects.filter((subject) => number(subject.credits) > 0 && number(subject.grade) >= 0);
    const credits = valid.reduce((sum, subject) => sum + number(subject.credits), 0);
    const weighted = credits ? valid.reduce((sum, subject) => sum + number(subject.credits) * number(subject.grade), 0) / credits : 0;
    const periodIndex = Math.min(4, Math.max(0, weighted / 25));
    const prevCredits = Math.max(0, number(previousCredits));
    const prevIndex = Math.min(4, Math.max(0, number(previousIndex)));
    const totalCareerCredits = prevCredits + credits;
    const accumulatedIndex = totalCareerCredits ? (prevIndex * prevCredits + periodIndex * credits) / totalCareerCredits : periodIndex;
    return { credits, weighted, count: valid.length, periodIndex, prevCredits, accumulatedIndex, totalCareerCredits };
  }, [previousCredits, previousIndex, subjects]);

  function update(id: string, field: keyof Subject, value: string) {
    setSubjects((items) => items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  return (
    <ToolPage
      title="Calculadora de índice académico"
      description="Calcula el índice del último período y estima el índice acumulado con tus créditos anteriores."
    >
      <section className="card formCard">
        <div className="rowHeader">
          <h2>Materias</h2>
          <button className="button small" type="button" onClick={() => setSubjects((items) => [...items, { id: uid(), name: "", credits: "", grade: "" }])}>
            <Plus size={18} /> Agregar
          </button>
        </div>

        {subjects.map((subject) => (
          <div className="inputGrid withDelete" key={subject.id}>
            <label>
              Nombre
              <input value={subject.name} onChange={(event) => update(subject.id, "name", event.target.value)} />
            </label>
            <label>
              Créditos
              <input type="number" min="0" value={subject.credits} onChange={(event) => update(subject.id, "credits", event.target.value)} />
            </label>
            <label>
              Nota final
              <input type="number" min="0" max="100" value={subject.grade} onChange={(event) => update(subject.id, "grade", event.target.value)} />
            </label>
            <button className="iconButton danger" type="button" aria-label="Eliminar materia" onClick={() => setSubjects((items) => items.filter((row) => row.id !== subject.id))}>
              <Trash2 size={18} />
            </button>
          </div>
        ))}

        <button className="button soft" type="button" onClick={() => setSubjects([])}>
          Limpiar todo
        </button>
      </section>

      <ResultCard>
        <div className="indexSummary">
          <article>
            <span>Índice Último Período</span>
            <strong>{fmt(result.periodIndex, 2)} de 4.0</strong>
            <small>Diferencia entre 4.0: {fmt(4 - result.periodIndex, 2)}</small>
          </article>
          <article>
            <span>Índice Acumulado</span>
            <strong>{fmt(result.accumulatedIndex, 2)} de 4.0</strong>
            <small>Diferencia entre 4.0: {fmt(4 - result.accumulatedIndex, 2)}</small>
          </article>
        </div>
        <div className="inputGrid twoCols">
          <label>
            Créditos acumulados anteriores
            <input type="number" min="0" value={previousCredits} onChange={(event) => setPreviousCredits(event.target.value)} />
          </label>
          <label>
            Índice acumulado anterior
            <input type="number" min="0" max="4" step="0.01" value={previousIndex} onChange={(event) => setPreviousIndex(event.target.value)} />
          </label>
        </div>
        <Metric label="Promedio ponderado" value={fmt(result.weighted)} />
        <Metric label="Créditos del período" value={fmt(result.credits, 0)} />
        <Metric label="Créditos acumulados totales" value={fmt(result.totalCareerCredits, 0)} />
        <Metric label="Cantidad de materias" value={`${result.count}`} />
        <p className="hint">Este cálculo es aproximado. La escala puede variar según tu universidad.</p>
      </ResultCard>
    </ToolPage>
  );
}

function AbsenceControl() {
  useTitle("Control de faltas | UniClaro");
  const [subjects, setSubjects] = useLocalStorage<AbsenceSubject[]>("uniclaro-faltas", []);

  function update(id: string, field: keyof AbsenceSubject, value: string) {
    setSubjects((items) => items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  }

  return (
    <ToolPage
      title="Control de faltas"
      description="Guarda tus materias y revisa si estás bien, en cuidado o en riesgo por acumulación de faltas."
    >
      <section className="card formCard">
        <div className="rowHeader">
          <h2>Materias</h2>
          <button
            className="button small"
            type="button"
            onClick={() => setSubjects((items) => [...items, { id: uid(), name: "", hoursPerClass: "2", classesPerWeek: "2", absences: "0", limit: "6" }])}
          >
            <Plus size={18} /> Agregar
          </button>
        </div>

        {subjects.length === 0 && <p className="empty">Agrega una materia para comenzar.</p>}

        {subjects.map((subject) => (
          <div className="inputGrid absences" key={subject.id}>
            <label>
              Materia
              <input value={subject.name} onChange={(event) => update(subject.id, "name", event.target.value)} />
            </label>
            <label>
              Horas por clase
              <input type="number" min="0" value={subject.hoursPerClass} onChange={(event) => update(subject.id, "hoursPerClass", event.target.value)} />
            </label>
            <label>
              Clases por semana
              <input type="number" min="0" value={subject.classesPerWeek} onChange={(event) => update(subject.id, "classesPerWeek", event.target.value)} />
            </label>
            <label>
              Faltas acumuladas
              <input type="number" min="0" value={subject.absences} onChange={(event) => update(subject.id, "absences", event.target.value)} />
            </label>
            <label>
              Límite permitido
              <input type="number" min="0" value={subject.limit} onChange={(event) => update(subject.id, "limit", event.target.value)} />
            </label>
            <button className="iconButton danger" type="button" aria-label="Eliminar materia" onClick={() => setSubjects((items) => items.filter((row) => row.id !== subject.id))}>
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </section>

      <div className="stack">
        {subjects.map((subject) => {
          const absences = number(subject.absences);
          const limit = number(subject.limit);
          const remaining = limit - absences;
          const hoursAbsent = absences * number(subject.hoursPerClass);
          const risk = remaining <= 0 ? "danger" : remaining <= Math.max(1, limit * 0.25) ? "warning" : "good";
          const label = risk === "danger" ? "En riesgo" : risk === "warning" ? "Cuidado" : "Bien";

          return (
            <ResultCard key={subject.id} tone={risk}>
              <h3>{subject.name || "Materia sin nombre"}</h3>
              <Metric label="Horas faltadas" value={`${fmt(hoursAbsent)} horas`} />
              <Metric label="Faltas restantes" value={`${Math.max(0, remaining)}`} />
              <Metric label="Nivel de riesgo" value={label} />
              <p className={`message ${risk}`}>{risk === "danger" ? "Estás en riesgo de perder la materia." : risk === "warning" ? "Cuidado, estás cerca del límite." : "Vas bien, todavía tienes margen."}</p>
            </ResultCard>
          );
        })}
      </div>
    </ToolPage>
  );
}

function StudyPlanner() {
  useTitle("Planificador de estudio | UniClaro");
  const [examDate, setExamDate] = useState("");
  const [topics, setTopics] = useState("10");
  const [hours, setHours] = useState("2");
  const [difficulty, setDifficulty] = useState("medio");

  const plan = useMemo(() => {
    if (!examDate) return { days: 0, topicsPerDay: 0, rows: [] as string[], warning: "Elige una fecha de examen para generar el plan." };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exam = new Date(`${examDate}T00:00:00`);
    const days = Math.ceil((exam.getTime() - today.getTime()) / 86400000);
    const totalTopics = number(topics);
    const hoursPerDay = number(hours);

    if (days <= 0 || totalTopics <= 0 || hoursPerDay <= 0) {
      return { days, topicsPerDay: 0, rows: [] as string[], warning: "Revisa la fecha, los temas y las horas disponibles." };
    }

    const reviewDay = days >= 3;
    const studyDays = reviewDay ? days - 1 : days;
    const difficultyBoost = difficulty === "difícil" ? 1.25 : difficulty === "fácil" ? 0.9 : 1;
    const topicsPerDay = Math.ceil((totalTopics / studyDays) * difficultyBoost);
    const rows: string[] = [];
    let current = 1;

    for (let day = 1; day <= studyDays && current <= totalTopics; day += 1) {
      const start = current;
      const end = Math.min(totalTopics, current + topicsPerDay - 1);
      rows.push(`Día ${day}: estudiar tema${start === end ? "" : "s"} ${start}${end > start ? ` al ${end}` : ""}.`);
      current = end + 1;
    }

    if (reviewDay) rows.push("Último día: repaso general y práctica.");

    const warning = days <= 2 ? "Queda poco tiempo. Prioriza los temas más importantes." : topicsPerDay > hoursPerDay * 2 ? "Hay muchos temas para pocas horas. Conviene priorizar." : "";
    return { days, topicsPerDay, rows, warning };
  }, [difficulty, examDate, hours, topics]);

  return (
    <ToolPage
      title="Planificador de estudio"
      description="Crea un plan simple por día según tu fecha de examen, temas, horas disponibles y dificultad."
    >
      <section className="card formCard compact">
        <label>
          Fecha del examen
          <input type="date" value={examDate} onChange={(event) => setExamDate(event.target.value)} />
        </label>
        <label>
          Cantidad de temas
          <input type="number" min="1" value={topics} onChange={(event) => setTopics(event.target.value)} />
        </label>
        <label>
          Horas disponibles por día
          <input type="number" min="0.5" step="0.5" value={hours} onChange={(event) => setHours(event.target.value)} />
        </label>
        <label>
          Dificultad
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            <option value="fácil">Fácil</option>
            <option value="medio">Medio</option>
            <option value="difícil">Difícil</option>
          </select>
        </label>
      </section>

      <ResultCard tone={plan.warning ? "warning" : "good"}>
        <Metric label="Días disponibles" value={`${Math.max(0, plan.days)}`} />
        <Metric label="Temas por día" value={`${plan.topicsPerDay}`} />
        {plan.warning && <p className="message warning">{plan.warning}</p>}
        <ol className="planList">
          {plan.rows.map((row) => (
            <li key={row}>{row}</li>
          ))}
        </ol>
      </ResultCard>
    </ToolPage>
  );
}

function Tasks() {
  useTitle("Organizador de tareas | UniClaro");
  const [tasks, setTasks] = useLocalStorage<Task[]>("uniclaro-tareas", []);
  const [statusFilter, setStatusFilter] = useState("todas");
  const [priorityFilter, setPriorityFilter] = useState("todas");
  const [form, setForm] = useState<Omit<Task, "id">>({
    title: "",
    subject: "",
    dueDate: "",
    priority: "media",
    status: "pendiente",
    note: "",
  });

  function addTask(event: FormEvent) {
    event.preventDefault();
    if (!form.title.trim()) return;
    setTasks((items) => [...items, { ...form, id: uid() }]);
    setForm({ title: "", subject: "", dueDate: "", priority: "media", status: "pendiente", note: "" });
  }

  const filtered = tasks
    .filter((task) => statusFilter === "todas" || task.status === statusFilter)
    .filter((task) => priorityFilter === "todas" || task.priority === priorityFilter)
    .sort((a, b) => (a.dueDate || "9999-12-31").localeCompare(b.dueDate || "9999-12-31"));

  return (
    <ToolPage
      title="Organizador de tareas"
      description="Agrega tareas universitarias, marca avances, filtra por estado o prioridad y ordénalas por fecha."
    >
      <form className="card formCard compact" onSubmit={addTask}>
        <label>
          Título
          <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
        </label>
        <label>
          Materia
          <input value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} />
        </label>
        <label>
          Fecha de entrega
          <input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
        </label>
        <label>
          Prioridad
          <select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as Task["priority"] })}>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </label>
        <label>
          Estado
          <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as Task["status"] })}>
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En progreso</option>
            <option value="completada">Completada</option>
          </select>
        </label>
        <label className="full">
          Nota opcional
          <textarea value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} />
        </label>
        <button className="button primary full" type="submit">
          Agregar tarea
        </button>
      </form>

      <section className="card filters">
        <label>
          Filtrar por estado
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="todas">Todas</option>
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En progreso</option>
            <option value="completada">Completada</option>
          </select>
        </label>
        <label>
          Filtrar por prioridad
          <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
            <option value="todas">Todas</option>
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </label>
      </section>

      <section className="taskList">
        {filtered.length === 0 && <p className="empty card">No hay tareas con esos filtros.</p>}
        {filtered.map((task) => (
          <article className={`card task priority-${task.priority}`} key={task.id}>
            <div>
              <h3>{task.title}</h3>
              <p>{task.subject || "Sin materia"} · {task.dueDate || "Sin fecha"} · {task.status}</p>
              {task.note && <p>{task.note}</p>}
            </div>
            <div className="taskActions">
              <span>{task.priority}</span>
              <button className="iconButton" type="button" aria-label="Marcar completada" onClick={() => setTasks((items) => items.map((item) => (item.id === task.id ? { ...item, status: "completada" } : item)))}>
                <Check size={18} />
              </button>
              <button className="iconButton danger" type="button" aria-label="Eliminar tarea" onClick={() => setTasks((items) => items.filter((item) => item.id !== task.id))}>
                <Trash2 size={18} />
              </button>
            </div>
          </article>
        ))}
      </section>
    </ToolPage>
  );
}

function ResultCard({
  children,
  errors = [],
  tone = "good",
}: {
  children: ReactNode;
  errors?: string[];
  tone?: "good" | "warning" | "danger";
}) {
  return (
    <section className={`card resultCard ${tone}`}>
      {errors.length > 0 && (
        <div className="errorBox">
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      )}
      {children}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
