import { Inter, Roboto, Great_Vibes, Montserrat, Playfair_Display } from "next/font/google";

export const inter = Inter({
    variable: "--font-inter-sans",
    subsets: ["latin"],
    weight: ['100', '300', '400', '500', '700', '900']
});
export const roboto = Roboto({
    subsets: ['latin'],
    weight: ['100', '300', '400', '500', '700', '900'],
    variable: "--font-roboto"
});

export const greatVibes = Great_Vibes({
    subsets: ['latin'],
    weight: ['400'], // Only 400 available
    variable: '--font-great-vibes'
});
export const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
    weight: ['100', '300', '400', '500', '700', '900']
});
export const playfairDisplay = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    weight: ['400', '500', '600', '700', '800', '900']
});




export const FONT_OPTIONS = [
    {name:"Inter", className:"font-inter-sans", weights: ['100', '300', '400', '500', '700', '900']},
    {name:"Roboto", className:"font-roboto", weights: ['100', '300', '400', '500', '700', '900']},
    {name:"Great Vibes", className:"font-great-vibes", weights: ['400']}, // Only 400 available
    {name:"Montserrat", className:"font-montserrat", weights: ['100', '300', '400', '500', '700', '900']},
    {name:"Playfair Display", className:"font-playfair", weights: ['400', '500', '600', '700', '800', '900']},
]