# Ghost CMS widget for Life Calendar
This widget is a yet-another implementation of the Tim Urban’s [Your Life in Weeks](https://waitbutwhy.com/2014/05/life-weeks.html).

It has the following features:
* Provide DOB and life expectancy
* Enter an array of life periods. Each period has a start and end date, title + the custom color
* Enter an array of milestones. Each milestone has a date, title, description and an optional image. Milestones are clickable circles that open a pop-up window

## Custom week adjustment.
Each year contains exactly 52 weeks. This prevents the date-drift, especially in the later periods.
Without this adjustment dates tend to shift because of rounding errors.

```
const data = {  
  dob: '1988-01-01',  
  lifeExpectancy: 76,  
  ranges: [  
    {start: '2028-01-01', end: '2028-12-31', title: 'Period', color: 'aqua'},
    {start: '2038-01-01', end: '2038-12-31', title: 'Period', color: 'aqua'},
    {start: '2048-01-01', end: '2048-12-31', title: 'Period', color: 'aqua'},
    {start: '2058-01-01', end: '2058-12-31', title: 'Period', color: 'aqua'}
  ],  
  milestones: [  
    {date: '2050-01-01', title: 'My Birthday!', desc: 'Some description 3'}
  ]  
};
```

![image](https://github.com/ed-parsadanyan/ghost-lifecalendar-bootstrap-wip/assets/10472129/946fce93-702c-4a12-8c85-7620a95a22d4)

## Dependencies
* Moment.js to calculate day intervals
* Bootstrap 5 (both CSS and JS) for styling and modal window

## Examples
### Bright theme

Overall
![image](https://github.com/ed-parsadanyan/ghost-lifecalendar-bootstrap-wip/assets/10472129/b1409131-1565-476d-9816-e9ad5fe55456)

Milestone
![image](https://github.com/ed-parsadanyan/ghost-lifecalendar-bootstrap-wip/assets/10472129/b273fae7-6f3e-4bc7-9108-3ee6363dac87)

### Bright theme

Overall
![image](https://github.com/ed-parsadanyan/ghost-lifecalendar-bootstrap-wip/assets/10472129/bf55a6db-2c34-44ae-9445-848bfb92e90b)

Milestone
![image](https://github.com/ed-parsadanyan/ghost-lifecalendar-bootstrap-wip/assets/10472129/e46e0009-b89c-4f71-bb77-e271dcff8c30)

