import { BeforeAfterSlider } from './BeforeAfterSlider';
import { CheckIcon } from './Icons';
import { Reveal } from './Reveal';
export function Transformation() {
  return <section id="transformation" className="section container" aria-labelledby="transformation-title"><div className="section-heading"><div><p className="eyebrow">01 / Разница в деталях</p><h2 id="transformation-title">Из коробок —<br/><span className="text-muted">в ваш уютный дом.</span></h2></div><p>Уже купили мебель? Самое сложное оставьте нам.<br className="hidden lg:block"/>Посмотрите, как меняется пространство.</p></div><Reveal className="transformation-grid"><BeforeAfterSlider/><div className="transformation-aside"><span className="large-index">A → B</span><h3>Вы выбираете мебель.<br/>Мы собираем.</h3><p>Аккуратно распакуем, разберёмся с инструкцией и соберём всё на своём месте.</p><ul>{['Бережно к полу и стенам', 'Внимание к креплениям и фурнитуре', 'Проверка дверей и ящиков'].map(item => <li key={item}><CheckIcon/>{item}</li>)}</ul><a href="#contact" className="text-link">Обсудить мою сборку <span>↗</span></a></div></Reveal></section>;
}
