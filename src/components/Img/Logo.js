/* eslint-disable max-len,react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';

const Logo = props => {
  const {
    color, height, width, ...otherProps
  } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 119.63"
      xmlns="http://www.w3.org/2000/svg"
      fill={color}
      {...otherProps}
      dangerouslySetInnerHTML={{
        __html:
          '<defs> <style>.cls-1{fill:#b32121;}</style> </defs> <title>logowm</title> <g id="SvgjsG1339"> <path class="cls-1" d="M211.85,84.71a2,2,0,0,0,2.77,0h0l31.19-31.18a2,2,0,0,0-2.75-2.81l0,0-29.79,29.8L203,70.28a2,2,0,0,0-2.78,2.77Z" transform="translate(-173 -15)"/> <path class="cls-1" d="M271.58,28.92l-48-13.85a2.19,2.19,0,0,0-1.08,0l-48,13.85A2,2,0,0,0,173,30.81V58.35a81.11,81.11,0,0,0,37,68.19l12,7.78a2,2,0,0,0,2.14,0l12-7.78a81.11,81.11,0,0,0,37-68.19V30.81A2,2,0,0,0,271.58,28.92Zm-2.5,29.43a77.16,77.16,0,0,1-35.2,64.9L223,130.33l-10.88-7.08a77.16,77.16,0,0,1-35.2-64.9V32.28L223,19l46.08,13.28Z" transform="translate(-173 -15)"/> <path class="cls-1" d="M181.8,35.68a2,2,0,0,0-1.42,1.89V60.88a68.89,68.89,0,0,0,31.44,58l10.11,6.58a2,2,0,0,0,2.14,0l10.11-6.58a68.89,68.89,0,0,0,31.44-58V37.57a2,2,0,0,0-1.41-1.89L223.54,24a2,2,0,0,0-1.08,0ZM261.7,39V60.88A65,65,0,0,1,232,115.56l-9,5.88-9-5.88A65,65,0,0,1,184.3,60.88V39L223,27.89Z" transform="translate(-173 -15)"/> </g>'
      }}
    />
  );
};

Logo.propTypes = {
  color: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Logo.defaultProps = {
  color: '#fff',
  width: '24',
  height: '24'
};

export default Logo;
