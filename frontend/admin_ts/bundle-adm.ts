/**
 * Created by Vlasakh on 27.12.2016.
 */

/// <reference path="./../js/.d/common.d.ts" />
/// <reference path="./../js/.d/jquery.d.ts" />

import { GroupsTree } from "./controllers/GroupsTree";
import { AddExchangeForm } from "./controllers/AddExchangeForm";


$(document).ready(function()
{
    (new GroupsTree()).init();
    (new AddExchangeForm()).init();
});