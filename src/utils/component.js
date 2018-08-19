import react from 'react';
import propTypes from 'prop-types';
import { connect as reduxConnect } from 'react-redux';
import styledComponents, { injectGlobal as ig } from 'styled-components';

export const React = react;
export const pt = propTypes;
export const connect = reduxConnect;
export const styled = styledComponents;
export const injectGlobal = ig;
