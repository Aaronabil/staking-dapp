import { type SVGProps } from 'react'

export default function Rabbywallet(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="1em"
            height="1em"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 204 152"
            {...props}
        >
            <defs>
                <linearGradient id="rabby-grad-1" gradientUnits="userSpaceOnUse" x1="82.68" y1="74.16" x2="148.23" y2="92.74" >
                    <stop offset="0" stopColor="#8797FF" />
                    <stop offset="1" stopColor="#AAA8FF" />
                </linearGradient>
                <linearGradient id="rabby-grad-2" gradientUnits="userSpaceOnUse" x1="134.76" y1="75.62" x2="87.46" y2="28.21" >
                    <stop offset="0" stopColor="#3B22A0" />
                    <stop offset="1" stopColor="#5156D8" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="rabby-grad-3" gradientUnits="userSpaceOnUse" x1="112.61" y1="99.91" x2="67.17" y2="73.79" >
                    <stop offset="0" stopColor="#3B1E8F" />
                    <stop offset="1" stopColor="#6A6FFB" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="rabby-grad-4" gradientUnits="userSpaceOnUse" x1="79.52" y1="79.55" x2="110.22" y2="118.56" >
                    <stop offset="0" stopColor="#8898FF" />
                    <stop offset="0.98" stopColor="#5F47F1" />
                </linearGradient>
            </defs>
            <path fill="url(#rabby-grad-1)" d="M148.9,81.9c3.7-8.3-14.7-31.6-32.3-41.2c-11.1-7.5-22.6-6.5-25-3.2c-5.1,7.2,17,13.4,31.8,20.5 c-3.2,1.4-6.2,3.9-7.9,7c-5.5-6-17.6-11.2-31.8-7c-9.6,2.8-17.5,9.5-20.6,19.5c-0.7-0.3-1.6-0.5-2.4-0.5c-3.3,0-6,2.7-6,6 c0,3.3,2.7,6,6,6c0.6,0,2.5-0.4,2.5-0.4L94,88.8c-12.3,19.6-22.1,22.4-22.1,25.8c0,3.4,9.3,2.5,12.8,1.2c16.8-6,34.8-24.9,37.9-30.3 C135.6,87.2,146.5,87.3,148.9,81.9z" />
            <path style={{ fillRule: 'evenodd', clipRule: 'evenodd' }} fill="url(#rabby-grad-2)" d="M123.5,58C123.5,58,123.5,58,123.5,58c0.7-0.3,0.6-1.3,0.4-2.1c-0.4-1.8-7.9-9.2-14.9-12.5c-9.6-4.5-16.6-4.3-17.6-2.2 c1.9,4,11,7.7,20.4,11.7C115.7,54.5,119.8,56.2,123.5,58C123.5,58,123.5,58,123.5,58z" />
            <path style={{ fillRule: 'evenodd', clipRule: 'evenodd' }} fill="url(#rabby-grad-3)" d="M111.3,98.2c-1.9-0.7-4.1-1.4-6.6-2c2.6-4.7,3.2-11.8,0.7-16.2c-3.5-6.2-7.9-9.5-18.2-9.5c-5.6,0-20.8,1.9-21.1,14.6 c0,1.3,0,2.5,0.1,3.7L94,88.8c-3.7,5.9-7.2,10.3-10.3,13.6c3.7,0.9,6.7,1.7,9.5,2.5c2.6,0.7,5.1,1.3,7.6,2 C104.6,104.1,108.2,101.1,111.3,98.2z" />
            <path fill="url(#rabby-grad-4)" d="M62.7,87.3c1.1,9.6,6.6,13.4,17.8,14.5 c11.2,1.1,17.6,0.4,26.1,1.1c7.1,0.6,13.5,4.3,15.8,3c2.1-1.1,0.9-5.2-1.9-7.8c-3.7-3.4-8.8-5.7-17.7-6.6c1.8-4.9,1.3-11.8-1.5-15.5 c-4-5.4-11.4-7.8-20.8-6.8C70.7,70.4,61.3,75.3,62.7,87.3z" />
        </svg>
    )
}
