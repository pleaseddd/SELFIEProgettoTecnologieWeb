import React, { useState, useEffect } from 'react';
import { gapi } from 'gapi-script';

const GoogleAPI = () => {
	const calendarID = process.env.REACT_APP_CALENDAR_ID;
	const apiKEY = process.env.REACT_APP_GOOGLE_API_KEY;
	const accessToken = process.env.REACT_APP_GOOGLE_ACCESS_TOKEN;

	return (
		<div className="pt-4">
			<h1 className="mb-4 text-2xl font-bold">
				google calendar
			</h1>
		</div>
	);
};

export default GoogleAPI;
