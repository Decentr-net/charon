const GA_KEY = 'UA-144841582-3';

const ga = document.createElement('script');
ga.type = 'text/javascript';
ga.async = true;
ga.src = 'https://ssl.google-analytics.com/ga.js';

ga.onload = () => {
  const _gaq = window._gaq || [];
  _gaq.push(['_setAccount', GA_KEY]);
  _gaq.push(['_trackPageview']);
};

const s = document.getElementsByTagName('script')[0];
s.parentNode.insertBefore(ga, s);

