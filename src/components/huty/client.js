/* Kalkulator folii na paletę: obliczenia + interfejs. Teksty PL tłumaczy translateScript(). */
/* Kalkulator masy folii na paletę (huty szkła). Czysta funkcja, bez DOM. */
(function (g) {
  var ASSUME = {
    top: 100,      // naddatek góry rękawa [mm]
    under: 100,    // undershrink pod płozami [mm]
    shrink: 10,    // naddatek na obkurcz [%]
    flat: 5,       // dodatek dla rękawa bez zakładek [%]
    rho: 0.92      // gęstość NEX-SHRINK GP [g/cm³]
  };
  var SCEN = [90, 80, 70];

  // powierzchnia rękawa [m²] = (obwód × (H + góra + undershrink) + L × W) × (1 + obkurcz) [× (1 + dodatek bez zakładek)]
  function area(p, a) {
    var per = 2 * (p.L + p.W) / 1000;
    var h = (p.H + a.top + a.under) / 1000;
    var base = per * h + (p.L * p.W) / 1e6;
    return base * (1 + a.shrink / 100) * (p.type === "flat" ? 1 + a.flat / 100 : 1);
  }

  function calc(p, assume) {
    var a = Object.assign({}, ASSUME, assume || {});
    var A = area(p, a);
    var row = function (t) {
      var gsm = t * a.rho;                 // g/m²
      var kg = A * gsm / 1000;             // kg na paletę
      var tYear = kg * p.pallets / 1000;   // t rocznie
      return { t: t, gsm: gsm, kg: kg, tYear: tYear, pcrT: tYear * (p.pcr || 0) / 100 };
    };
    var now = row(p.t0);
    var scen = SCEN.filter(function (t) { return t < p.t0; }).map(function (t) {
      var r = row(t);
      r.saveT = now.tYear - r.tYear;
      r.savePct = (1 - t / p.t0) * 100;
      r.saveMoney = p.price > 0 ? r.saveT * 1000 * p.price : null;
      return r;
    });
    return { area: A, now: now, costNow: p.price > 0 ? now.tYear * 1000 * p.price : null, scen: scen, assume: a };
  }

  var api = { calc: calc, area: area, ASSUME: ASSUME, SCEN: SCEN };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else g.KxHuty = api;
})(this);

(function(){
  const $=id=>document.getElementById("kxh_"+id);
  const num=s=>{s=String(s).replace(/[\s ]/g,"").replace(",",".");return s===""?NaN:+s};
  const f=(x,d)=>x.toLocaleString("pl-PL",{minimumFractionDigits:d,maximumFractionDigits:d});
  let type="gusset",started=false,summary="",tmr,pick=null;
  const ev=(name,p)=>{(window.dataLayer=window.dataLayer||[]).push(Object.assign({event:name},p||{}))};
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CASE_URL="https://kablonex.pl/case-study/downgauging-ze-130-do-70-90-%c2%b5m-i-odpornosc-termiczna-w-transporcie-weekendowym-dla-wiodacej-huty-szkla-2/";
  const CASE_PCT=31; // wynik z wdrożenia w hucie: 130 → 90 µm

  /* Link do kalendarza rezerwacji (MS Bookings). Pusty = pokazuje notę i kieruje do formularza. */
  const BOOK_URL="";

  function attach(){
    if(!$("attach"))return; // formularz jest na kablonex.pl
    $("attach").className=started?"attach":"need";
    $("attach").innerHTML=started
      ?'<b>Do wiadomości dołączymy wynik kalkulatora:</b><br>'+summary
      :'<p>Nie korzystaliście z kalkulatora. Podajcie dwie liczby albo <a href="#kalkulator">policzcie w 2 minuty</a>.</p><div class="grid2"><div class="fld"><label for="kxh_f_pal">Palet rocznie <span class="req">*</span></label><div class="inp"><input id="kxh_f_pal" inputmode="numeric" required><span>szt.</span></div></div><div class="fld"><label for="kxh_f_t">Obecna grubość <span class="req">*</span></label><div class="inp"><input id="kxh_f_t" inputmode="decimal" required><span>µm</span></div></div></div>';
  }
  function used(){if(started)return;started=true;ev("calc_start");attach();sticky()}
  $("type").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;type=b.dataset.v;[...$("type").children].forEach(x=>x.setAttribute("aria-pressed",x===b));used();upd()});
  document.addEventListener("input",e=>{if(e.target.closest(".calc .c-in")){used();upd()}});
  document.addEventListener("change",e=>{if(e.target.closest(".calc .c-in")){used();upd()}});
  document.addEventListener("click",e=>{const a=e.target.closest(".kxh [data-ev]");if(a)ev(a.dataset.ev)});
  $("out").addEventListener("click",e=>{const a=e.target.closest("[data-t]");if(!a)return;e.preventDefault();pick=+a.dataset.t;used();upd();ev("calc_scenario",{t:pick})});

  function upd(){
    const ids=["L","W","H","t0","pallets"],p={type};let ok=true;
    ids.forEach(k=>{const v=num($(k).value);const good=v>0;$(k).parentNode.classList.toggle("bad",!good);if(!good)ok=false;p[k]=v});
    p.price=num($("price").value)||0;p.pcr=+$("pcr").value;
    const a={top:num($("a_top").value),under:num($("a_under").value),shrink:num($("a_shrink").value),flat:num($("a_flat").value),rho:num($("a_rho").value)};
    if(Object.values(a).some(v=>!(v>=0))||!(a.rho>0))ok=false;
    const out=$("out");
    if(!ok){out.innerHTML='<h3>Wynik</h3><p style="margin:0">Wpiszcie liczby większe od zera we wszystkich polach.</p>';return}
    const r=KxHuty.calc(p,a),cur=$("cur").value,money=p.price>0,max=r.now.kg;
    const bar=(x,cls,lab)=>'<div class="bar '+cls+'"><span class="t">'+lab+'</span><div class="track"><div class="fill" data-w="'+(x.kg/max*100).toFixed(1)+'"></div></div><span class="bv">'+f(x.kg,2)+' kg'+(x.savePct?'<em>−'+f(x.savePct,0)+'%</em>':'')+'</span></div>';
    const nowRow='<div class="now-row"><span>Dziś: <b>'+f(r.now.kg,2)+' kg</b>/paletę</span><span><b>'+f(r.now.tYear,1)+' t</b>/rok</span>'+(money?'<span><b>'+f(r.costNow,0)+' '+cur+'</b>/rok</span>':'')+'<span><b>'+f(r.area,1)+' m²</b> rękawa</span>'+(p.pcr?'<span><b>'+f(r.now.pcrT,1)+' t</b> recyklatu przy '+p.pcr+'% PCR</span>':'')+'</div>';
    const caveat='<p class="caveat">Scenariusz do weryfikacji próbą na Waszej linii. Nie deklarujemy grubości przed próbą.</p>';
    let h,s=null;
    if(r.scen.length){
      // domyślnie scenariusz najbliższy wynikowi z wdrożenia (−31%), chyba że użytkownik wybrał inny
      s=r.scen.find(x=>x.t===pick)||r.scen.reduce((b,x)=>Math.abs(x.savePct-CASE_PCT)<Math.abs(b.savePct-CASE_PCT)?x:b);
      const money1=money?Math.round(s.saveMoney):0;
      const days=Math.round(s.saveT/r.now.tYear*365);
      const pal=Math.round(s.saveT*1000/r.now.kg);
      h='<div class="save">'
        +'<div class="lab">Możliwa oszczędność rocznie · <span>'+s.t+' µm zamiast '+f(p.t0,0)+' µm</span></div>'
        +(money?'<div class="hv">−'+f(money1,0)+'<small>'+cur+'/rok</small></div>'
               :'<div class="hv">−'+f(s.saveT,1)+'<small>t folii/rok</small></div>')
        +'<p class="sub"><b>−'+f(s.saveT,1)+' t folii</b> i <b>−'+f(s.savePct,0)+'%</b> masy na każdej palecie'+(money?', przy Waszej cenie '+f(p.price,2)+' '+cur+'/kg':'')+'.</p>'
        +'<div class="eq">'
          +(money?'<div><b>−'+f(money1*5,0)+' '+cur+'</b>w 5 lat</div>':'<div><b>−'+f(s.saveT*5,0)+' t</b>folii w 5 lat</div>')
          +'<div><b>'+days+' dni</b>produkcji rocznie bez kupowania folii</div>'
          +'<div><b>'+f(pal,0)+'</b>palet rocznie owiniętych „za darmo”</div>'
        +'</div>'
        +(money?'':'<p class="ask">Wpiszcie Waszą cenę za kg, a pokażemy tę kwotę w złotówkach.</p>')
        +(r.scen.length>1?'<div class="pick">Scenariusz: '+r.scen.map(x=>'<a href="#" role="button" data-t="'+x.t+'" class="'+(x.t===s.t?'on':'')+'" aria-pressed="'+(x.t===s.t)+'">'+x.t+' µm · −'+f(x.savePct,0)+'%</a>').join("")+'</div>':'')
        +'<p class="proof-l">W hucie szkła zeszliśmy ze 130 do 90 µm (−31%), w części dostaw do 70 µm. <a href="'+CASE_URL+'">Zobacz case</a></p>'
        +'</div>'
        +nowRow
        +'<div class="bars">'+bar(r.now,"now","dziś")+r.scen.map(x=>bar(x,"sc",x.t+" µm")).join("")+'</div>'
        +caveat
        +'<div class="btns"><a class="btn btn-red" href="#rozmowa" data-ev="booking_click">Sprawdźmy te '+(money?f(money1,0)+' '+cur:f(s.saveT,1)+' t')+' (20 min) <span class="ic" aria-hidden="true">→</span></a><a class="btn btn-soft" href="#kxh_form">Wyślij wynik</a></div>';
    }else{
      h='<h3>Wynik dla Waszej palety</h3>'+nowRow
        +'<p style="margin:0">Przy tej grubości liczymy z Wami indywidualnie: granicę pocienienia wyznacza próba na linii.</p>'
        +caveat
        +'<div class="btns"><a class="btn btn-red" href="#rozmowa" data-ev="booking_click">Omów wynik (20 min) <span class="ic" aria-hidden="true">→</span></a><a class="btn btn-soft" href="#kxh_form">Wyślij wynik</a></div>';
    }
    out.innerHTML=h;
    requestAnimationFrame(()=>out.querySelectorAll(".fill").forEach(x=>x.style.width=x.dataset.w+"%"));
    setTimeout(()=>out.querySelectorAll(".fill").forEach(x=>x.style.width=x.dataset.w+"%"),50);
    summary='Paleta '+f(p.L,0)+'×'+f(p.W,0)+'×'+f(p.H,0)+' mm, '+(type==="gusset"?"z zakładkami":"bez zakładek")+', '+f(p.t0,0)+' µm, '+f(p.pallets,0)+' palet/rok · '+f(r.now.kg,2)+' kg/paletę · '+f(r.now.tYear,1)+' t/rok'+(money?' · koszt '+f(r.costNow,0)+' '+cur+'/rok przy '+f(p.price,2)+' '+cur+'/kg':'')+(p.pcr?' · PCR '+p.pcr+'%':'')
      +(s?' · OSZCZĘDNOŚĆ przy '+s.t+' µm: −'+f(s.saveT,1)+' t/rok (−'+f(s.savePct,0)+'%)'+(money?', −'+f(Math.round(s.saveMoney),0)+' '+cur+'/rok':''):'');
    if(started){attach();clearTimeout(tmr);tmr=setTimeout(()=>ev("calc_result",{kg_pallet:+r.now.kg.toFixed(3),t_year:+r.now.tYear.toFixed(1),t0:p.t0,scen_t:s?s.t:null,save_t:s?+s.saveT.toFixed(1):null,save_money:s&&money?Math.round(s.saveMoney):null}),1200)}
  }

  // sticky CTA (telefon)
  const vis={hero:true,book:false,calc:false};
  function sticky(){
    const b=$("stickyBtn");
    if(started){b.textContent="Umów 20 min z technologiem";b.href="#rozmowa";b.dataset.ev="booking_click"}
    $("sticky").classList.toggle("on",!vis.hero&&!vis.book&&!(vis.calc&&!started));
  }
  const watch=[[".hero","hero"],["#rozmowa","book"],[".calc","calc"]].map(([q,k])=>[document.querySelector(".kxh "+q),k]);

  // wejścia sekcji (przewijanie, bez IntersectionObserver: działa też w ukrytej karcie)
  const rv=[...document.querySelectorAll(".kxh .rv")];
  if(!reduce)document.querySelector(".kxh").classList.add("anim");
  function onScroll(){
    const H=innerHeight;
    rv.forEach(el=>{if(!el.classList.contains("in")&&el.getBoundingClientRect().top<H*0.9)el.classList.add("in")});
    watch.forEach(([el,k])=>{const r=el.getBoundingClientRect();vis[k]=r.bottom>0&&r.top<H});sticky();
  }
  addEventListener("scroll",onScroll,{passive:true});addEventListener("resize",onScroll);
  setTimeout(()=>rv.forEach(el=>el.classList.add("in")),2500); // zabezpieczenie: nic nie zostaje ukryte
  upd();attach();onScroll();

  // Rezerwacja rozmowy
  $("bookBtn").addEventListener("click",e=>{e.preventDefault();if(BOOK_URL){ev("booking_open");window.open(BOOK_URL,"_blank","noopener")}else{$("bookNote").hidden=false;ev("booking_fallback")}});

})();
