Web Application for Visualizing the Optical Constants of Metals

Optical constants described by the Drude-Lorentz model.

Software stack is entirely javascript. Serving with Node. Routing with Express. Database with MongoDB. Model-View-Controller with Angular. Visualizations with D3. Math with mathjs.

To Do:

- Convert form validation/submission to 100% angular. The traditional /POST system is limiting.
- Figure out how to efficiently compute the maximum/minimum permittivity with the inclusion of the Lorentzian terms.
- Dynamically scale panels and plots with screen size.
- Add user/administration functionality.
- Add plot labels and a responsive cursor to the D3 plot.
- Figure out how to deal with complex numbers when computing the complex permittivity.
- Option to view permittivity/refractive index and eV/frequency/wavelength