import styled, {createGlobalStyle} from 'styled-components'
import style from 'styled-theming'

export const themeMix = (darkColor: string, lightColor: string) => {
    return style('mode', {
        dark: darkColor,
        light: lightColor,
    })
}

export const STATIC_COLOR = {
    perpChartGridColor: {
        dark: '#282A33',
        light: '#e6e7e9',
    },
    perpHeaderBackground: {
        dark: '#202327',
        light: '#fff',
    },
    perpMacdColor: {
        dark: '#d9d9d9',
        light: '#101215',
    },
}

export const ADJUST_CONFIGS = {
    wideScreenVisibleWidth: 1440,
    middleScreenVisibleWidth: 1024,
}

export const mainTheme = {
    // header theme
    mainBg: themeMix('#e5e5e5', '#fff'),
    infoColor: '#fff',
    warningColor: '#faac14',
    successColor: '#53c31b',
    errorColor: '#e3686a',

    mediaQueries: {
        sm: '@media screen and (min-width: 1080px)',
        md: '@media screen and (min-width: 370px)',
        lg: '@media screen and (min-width: 1200px)',
    },
}

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${mainTheme.mainBg} !important;
    font-family: Source Han Sans CN;
  }
`

export const WrapperInner = styled.div`
    width: 1200px;
    margin: 0 auto;
    /* width: ${ADJUST_CONFIGS.wideScreenVisibleWidth + 'px'};
    margin: 0 auto;

    @media (min-width: 770px) and (max-width: 1560px) {
        width: ${ADJUST_CONFIGS.wideScreenVisibleWidth + 'px'};
    } */

    @media (max-width: 769px) {
        width: 100%;
    }
`
