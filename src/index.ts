import {BlackBoxDataTable} from './black-box-data-table';
import {Amazon} from './amazon';

const amazon = new Amazon();

const myDataTable = new BlackBoxDataTable(amazon);

myDataTable.initialize();
