Web Application for Visualizing the Optical Constants of Metals

Optical constants described by the Drude-Lorentz model.

Software stack is entirely javascript. Serving with Node. Routing with Express. Database with MongoDB. Model-View-Controller with Angular. Visualizations with D3. Math with mathjs.

To Do:

- Convert form validation/submission to 100% angular. The traditional /POST system is limiting.
- Optimize auto-plot scaling to maximize space filled, without cutting off the plot
- Add user/administration functionality.
- Add plot labels and a responsive cursor to the D3 plot.
- Option to view permittivity/refractive index and eV/frequency/wavelength
- Debounce the input fields to minimize handling invocations
- Has trouble serving pages when under large loads, do some optimization