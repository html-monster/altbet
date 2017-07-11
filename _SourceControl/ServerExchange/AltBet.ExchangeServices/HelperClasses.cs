/* WARNING! This program and source code is owned and licensed by 
   Modulus Financial Engineering, Inc. http://www.modulusfe.com
   Viewing or use this code requires your acceptance of the license
   agreement found at http://www.modulusfe.com/support/license.pdf
   Removal of this comment is a violation of the license agreement.
   Copyright 2002-2016 by Modulus Financial Engineering, Inc. */

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MaxMind.GeoIP2;
using MaxMind.GeoIP2.Responses;
using System.Net;
using System.Web;

namespace  AltBet.Exchange
{
    public class ExchangeSettingsEx
    {
        public string Name;
        public TimeSpan StartTime;
        public TimeSpan EndTime;
        public List<ExchangeSymbol> Symbols;
        public bool CommonCurrency;
        public bool Closed;

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        public ExchangeSettingsEx() { }

        public ExchangeSettingsEx(ExchangeSettingsEx exchangeSettings)
        {
            Name = exchangeSettings.Name;
            StartDate = exchangeSettings.StartDate;
            EndDate = exchangeSettings.EndDate;
            Symbols = exchangeSettings.Symbols.Select(s => new ExchangeSymbol() { ID = s.ID, Symbol = new Symbol() { Name = s.Symbol.Name, Exchange = s.Symbol.Exchange, Currency = s.Symbol.Currency } }).ToList();
            CommonCurrency = exchangeSettings.CommonCurrency;
        }

        public ExchangeSettingsEx(ExchangeSettings exchangeSettings)
        {
            Name = exchangeSettings.Name;
            StartTime = exchangeSettings.StartTime;
            EndTime = exchangeSettings.EndTime;
            StartDate = exchangeSettings.StartDate;
            EndDate = exchangeSettings.EndDate;
            Symbols = new List<ExchangeSymbol>();
            CommonCurrency = exchangeSettings.CommonCurrency;
        }

        public void Init()
        {
            StartDate = DateTime.UtcNow.Date.Add(StartTime);
            EndDate = DateTime.UtcNow.Date.Add(EndTime);
        }

        public void Init(DateTime startDate, DateTime endDate)
        {
            StartDate = startDate;
            EndDate = endDate;
        }

        public void UpdateDateTime()
        {
            DateTime newDate = EndDate.Date.AddDays(1);
            StartDate = newDate.Date.Add(StartTime);
            StartDate = DateTime.SpecifyKind(StartDate, DateTimeKind.Utc);
            EndDate = newDate.Date.Add(EndTime);
            EndDate = DateTime.SpecifyKind(EndDate, DateTimeKind.Utc);
        }
    }

    public partial class Tick
    {
        public Tick()
        {

        }
        public Tick(DateTime time, decimal price, long volume, bool side)
            : base()
        {
            Time = time;
            Time = DateTime.SpecifyKind(Time, DateTimeKind.Utc);
            Price = price;
            Volume = volume;
            Side = side;
        }

        public Tick(Symbol symbol, DateTime time, decimal price, long volume, bool side)
            : base()
        {
            Symbol = symbol;
            Time = time;
            Time = DateTime.SpecifyKind(Time, DateTimeKind.Utc);
            Price = price;
            Volume = volume;
            Side = side;
        }

        public Tick(Symbol symbol, DateTime time, decimal price, long volume, decimal bid, long bidSize, decimal ask, long askSize, bool side)
        {
            Symbol = symbol;
            Time = time;
            Time = DateTime.SpecifyKind(Time, DateTimeKind.Utc);
            Price = price;
            Volume = volume;
            Bid = bid;
            BidSize = bidSize;
            Ask = ask;
            AskSize = askSize;
            Side = side;
            
        }

        public object Clone()
        {
            return new Tick
            {
                Ask = this.Ask,
                AskSize = this.AskSize,
                Bid = this.Bid,
                BidSize = this.BidSize,
                Currency = this.Currency,
                Price = this.Price,
                Symbol = this.Symbol,
                Time = this.Time,
                Volume = this.Volume,
                Side = this.Side
            };
        }
    }

    public partial class Bar
    {
        public Bar() { }

        public Bar(DateTime date, decimal open, decimal high, decimal low, decimal close, long volume, bool side)
        {
            Time = date;
            Time = DateTime.SpecifyKind(Time, DateTimeKind.Utc);
            Open = open;
            High = high;
            Low = low;
            Close = close;
            Volume = volume;
            Side = side;
            EndDate = SqlDateTime.MinValue.Value;
        }

        public void SetDate(DateTime date)
        {
            Time = date;
            Time = DateTime.SpecifyKind(Time, DateTimeKind.Utc);
        }

        public void Init(Tick tick, Periodicity periodicity, TimeSpan startTime)
        {
            if (Time == DateTime.MinValue)
            {
                if (periodicity == Periodicity.Monthly)
                {
                    EndDate = new DateTime(tick.Time.Year, tick.Time.Month, 1, 0, 0, 0).AddMonths(1);
                }
                else if (periodicity == Periodicity.Weekly)
                {
                    EndDate = new DateTime(tick.Time.Year, tick.Time.Month, tick.Time.Day, 0, 0, 0).AddDays(7 * 1);
                }
                else if (periodicity == Periodicity.Daily)
                {
                    EndDate = new DateTime(tick.Time.Year, tick.Time.Month, tick.Time.Day, 0, 0, 0).AddDays(1);
                }
                else if (periodicity == Periodicity.Hourly)
                {
                    EndDate = tick.Time.Date.Add(startTime);
                    while (EndDate <= tick.Time)
                    {
                        EndDate = EndDate.AddHours(1);
                    }
                }
                else if (periodicity == Periodicity.Minutely)
                {
                    EndDate = tick.Time.Date.Add(startTime);
                    while (EndDate <= tick.Time)
                    {
                        EndDate = EndDate.AddMinutes(1);
                    }
                }
                else if (periodicity == Periodicity.Secondly)
                {
                    EndDate = tick.Time.Date.Add(startTime);
                    while (EndDate <= tick.Time)
                    {
                        EndDate = EndDate.AddSeconds(1);
                    }
                }
            }
            else
            {
                if (periodicity == Periodicity.Monthly)
                {
                    while (EndDate <= tick.Time)
                    {
                        EndDate = EndDate.AddMonths(1);
                    }
                }
                else if (periodicity == Periodicity.Weekly)
                {
                    while (EndDate <= tick.Time)
                    {
                        EndDate = EndDate.AddDays(7 * 1);
                    }
                }
                else if (periodicity == Periodicity.Daily)
                {
                    while (EndDate <= tick.Time)
                    {
                        EndDate = EndDate.AddDays(1);
                    }
                }
                else if (periodicity == Periodicity.Hourly)
                {
                    while (EndDate <= tick.Time)
                    {
                        EndDate = EndDate.AddHours(1);
                    }
                }
                else if (periodicity == Periodicity.Minutely)
                {
                    while (EndDate <= tick.Time)
                    {
                        EndDate = EndDate.AddMinutes(1);
                    }
                }
                else if (periodicity == Periodicity.Secondly)
                {
                    while (EndDate <= tick.Time)
                    {
                        EndDate = EndDate.AddSeconds(1);
                    }
                }
            }
            Time = tick.Time;
            Time = DateTime.SpecifyKind(Time, DateTimeKind.Utc);
            Open = tick.Price;
            High = tick.Price;
            Low = tick.Price;
            Close = tick.Price;
            Volume = tick.Volume;
            Side = tick.Side;
        }

        public void AppendTick(Tick tick)
        {
            Time = tick.Time;
            Time = DateTime.SpecifyKind(Time, DateTimeKind.Utc);
            High = Math.Max(High, tick.Price);
            Low = Math.Min(Low, tick.Price);
            Close = tick.Price;
            Volume += tick.Volume;
            Side = tick.Side;
        }

        public void Init(Bar bar, Periodicity periodicity, int interval, TimeSpan startTime)
        {
            if (Time == DateTime.MinValue)
            {
                if (periodicity == Periodicity.Monthly)
                {
                    while (EndDate <= bar.Time)
                    {
                        EndDate = EndDate.AddMonths(interval);
                    }
                }
                else if (periodicity == Periodicity.Weekly)
                {
                    while (EndDate <= bar.Time)
                    {
                        EndDate = EndDate.AddDays(7 * interval);
                    }
                }
                else if (periodicity == Periodicity.Daily)
                {
                    while (EndDate <= bar.Time)
                    {
                        EndDate = EndDate.AddDays(interval);
                    }
                }
                else if (periodicity == Periodicity.Hourly)
                {
                    EndDate = bar.Time.Date.Add(startTime);
                    while (EndDate <= bar.Time)
                    {
                        EndDate = EndDate.AddHours(interval);
                    }
                }
                else if (periodicity == Periodicity.Minutely)
                {
                    EndDate = bar.Time.Date.Add(startTime);
                    while (EndDate <= bar.Time)
                    {
                        EndDate = EndDate.AddMinutes(interval);
                    }
                }
                else if (periodicity == Periodicity.Secondly)
                {
                    EndDate = bar.Time.Date.Add(startTime);
                    while (EndDate <= bar.Time)
                    {
                        EndDate = EndDate.AddSeconds(interval);
                    }
                }
            }
            else
            {
                if (periodicity == Periodicity.Monthly)
                {
                    while (EndDate <= bar.Time)
                    {
                        EndDate = EndDate.AddMonths(interval);
                    }
                }
                else if (periodicity == Periodicity.Weekly)
                {
                    while (EndDate <= bar.Time)
                    {
                        EndDate = EndDate.AddDays(7 * interval);
                    }
                }
                else if (periodicity == Periodicity.Daily)
                {
                    while (EndDate <= bar.Time)
                    {
                        EndDate = EndDate.AddDays(interval);
                    }
                }
                else if (periodicity == Periodicity.Hourly)
                {
                    while (EndDate <= bar.Time)
                    {
                        EndDate = EndDate.AddHours(interval);
                    }
                }
                else if (periodicity == Periodicity.Minutely)
                {
                    while (EndDate <= bar.Time)
                    {
                        EndDate = EndDate.AddMinutes(interval);
                    }
                }
                else if (periodicity == Periodicity.Secondly)
                {
                    while (EndDate <= bar.Time)
                    {
                        EndDate = EndDate.AddSeconds(interval);
                    }
                }
            }
            Time = bar.Time;
            Time = DateTime.SpecifyKind(Time, DateTimeKind.Utc);
            Open = bar.Open;
            High = bar.High;
            Low = bar.Low;
            Close = bar.Close;
            Volume = bar.Volume;
            Side = bar.Side;
        }

        public void AppendBar(Bar bar)
        {
            Time = bar.Time;
            Time = DateTime.SpecifyKind(Time, DateTimeKind.Utc);
            High = Math.Max(High, bar.High);
            Low = Math.Min(Low, bar.Low);
            Close = bar.Close;
            Volume = bar.Volume;
            Side = bar.Side;
        }
    }

    public static class Extensions
    {
        public static List<T> Clone<T>(this IList<T> listToClone) where T : ICloneable
        {
            return listToClone.Select(item => (T)item.Clone()).ToList();
        }
    }

    public partial class Symbol
    {       
        public override bool Equals(object obj)
        {
            bool result = false;
            if (obj != null)
            {
                Symbol p = obj as Symbol;
                if ((System.Object)p != null)
                {
                    result = (Name == p.Name) && (Exchange == p.Exchange) && (Currency == p.Currency);
                }
            }
            return result;
        }
    }

    public class ExchangeSymbol
    {
        public string ID;
        public Symbol Symbol;
    }

    public partial class NewOrderRequest
    {
        public override string ToString()
        {
            string result = string.Format("ID: {1}{0}Symbol: {2}{0}Time: {3}{0}Account: {4}{0}Side: {5}{0}OrderType: {6}{0}LimitPrice: {7}{0}StopPrice: {8}{0}Quantity: {9}{0}TimeInForce: {10}{0}ExpirationDate: {11}",
                Environment.NewLine, ID, Symbol, Time, Account, Enum.GetName(typeof(Side), Side), Enum.GetName(typeof(Type), OrderType), LimitPrice, StopPrice, Quantity, Enum.GetName(typeof(TimeInForce), TimeInForce), ExpirationDate);            
            return result;
        }

        public object Clone()
        {
            return new NewOrderRequest
            {
                Account = this.Account,
                ActivationTime = this.ActivationTime,
                ExpirationDate = this.ExpirationDate,
                ID = this.ID,
                IsMirror = this.IsMirror,
                LimitPrice = this.LimitPrice,
                OrderType = this.OrderType,
                Quantity = this.Quantity,
                Side = this.Side,
                StopPrice = this.StopPrice,
                Symbol = this.Symbol,
                Time = this.Time,
                TimeInForce = this.TimeInForce
            };
        }
    }

    public partial class Execution
    {
        public override string ToString()
        {
            string result = string.Format("OrderID: {1}{0}Time: {2}{0}Status: {3}{0}LastPrice: {4}{0}LastQuantity: {5}{0}FilledQuantity: {6}{0}LeaveQuantity: {7}{0}CancelledQuantity: {8}{0}AverrageFillPrice: {9}{0}Message: {10}",
                Environment.NewLine, OrderID, Time, Enum.GetName(typeof(Status), Status), LastPrice, LastQuantity, FilledQuantity, LeaveQuantity, CancelledQuantity, AverrageFillPrice, Message);
            return result;
        }
    }

    public class AccountComparer : IEqualityComparer<Account>
    {
        public bool Equals(Account x, Account y)
        {
            bool result = false;
            if (Object.ReferenceEquals(x, y))
            {
                result = true;
            }
            else
            {
                result = x != null && y != null && x.Name.Equals(y.Name);
            }
            return result;
        }

        public int GetHashCode(Account obj)
        {
            return obj.Name == null ? 0 : obj.Name.GetHashCode();
        }
    }

    public class SymbolComparer : IEqualityComparer<Symbol>
    {
        public bool Equals(Symbol x, Symbol y)
        {
            bool result = false;
            if (Object.ReferenceEquals(x, y))
            {
                result = true;
            }
            else
            {
                result = x != null && y != null && x.Name.Equals(y.Name) && x.Exchange.Equals(y.Exchange) && x.Currency.Equals(y.Currency);
            }
            return result;
        }

        public int GetHashCode(Symbol obj)
        {
            return (obj.Name == null ? 0 : obj.Name.GetHashCode()) + (obj.Exchange == null ? 0 : obj.Exchange.GetHashCode() + (obj.Currency == null ? 0 : obj.Currency.GetHashCode() ));
        }
    }   

    public class Cache
    {
        private List<ExchangeSettingsEx> _exchanges;
        private List<CachedSymbol> _cachedSymbols = new List<CachedSymbol>();
        private string _connectionString = null;

        public Cache(List<ExchangeSettingsEx> exchangesSettings, string connectionString)
        {
            _exchanges = exchangesSettings;
            _connectionString = connectionString;            
            _exchanges.ForEach(e => 
            {
                //remove previous days tick data from database
                var connection = new SqlConnection(_connectionString);
                try
                {
                    connection.Open();
                    SqlCommand command = connection.CreateCommand();
                    //TODO: check request below (clear all data in the tick table over all exchanges)
                    command.CommandText = string.Format("UPDATE [{0}] SET [IsDeleted] = 1 WHERE [Time] < @StartDate", Enum.GetName(typeof(Periodicity), Periodicity.Tick));
                    command.Parameters.AddWithValue("StartDate", e.StartDate);
                    command.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                    Log.SendEmail(string.Format("{0} Failed to clear ticks on start: {1}", DateTime.Now.ToString(), ex.Message));
                }
                finally
                {
                    if (connection.State == System.Data.ConnectionState.Open)
                    {
                        connection.Close();
                    }
                }
                e.Symbols.ForEach(s =>
                {   
                    //get last tick data from database
                    var tick = GetLastTick(s.Symbol);
                    //if tick has traded price then update last tick
                    if (tick != null && tick.Price != 0)
                    {
                        AppendTick(tick, false);
                    }
                });
            });
        }

        public void AppendTick(Tick tick, bool save)
        {
            var exchangeSettings = _exchanges.FirstOrDefault(exchange => exchange.Name.ToUpper() == tick.Symbol.Exchange.ToUpper());
            if (exchangeSettings != null)
            {
                if (_cachedSymbols.FirstOrDefault(item => item.Symbol.Symbol.Equals(tick.Symbol)) == null)
                {
                    var symbol = _exchanges.SelectMany(e => e.Symbols).Where(s => s.Symbol.Equals(tick.Symbol)).FirstOrDefault();
                    if (symbol != null)
                    {
                        _cachedSymbols.Add(new CachedSymbol(symbol, new ExchangeSettingsEx(exchangeSettings), _connectionString, tick));                       
                    }
                }
                var cachedSymbol = _cachedSymbols.FirstOrDefault(item => item.Symbol.Symbol.Equals(tick.Symbol));
                if (cachedSymbol != null)
                {
                    cachedSymbol.AppendTick(tick, save);
                }
            }
        }

        public List<Bar> GetHistory(HistoryParameters request)
        {
            var result = new List<Bar>();
            if (_cachedSymbols.FirstOrDefault(item => item.Symbol.Symbol.Equals(request.Symbol)) != null)
            {
                result = _cachedSymbols.First(item => item.Symbol.Symbol.Equals(request.Symbol)).GetHistory(request);
            }
            else
            {
                var exchangeSettings = _exchanges.FirstOrDefault(e => e.Name == request.Symbol.Exchange);
                if (exchangeSettings != null)
                {
                    result = HistoryHelper.GetHistory(request, new List<Tick>(), _connectionString, exchangeSettings);
                }
            }
            return result;
        }

        public Tick GetLastTick(Symbol symbol)
        {
            Tick result = null;
            var cachedSymbol = _cachedSymbols.FirstOrDefault(item => item.Symbol.Symbol.Equals(symbol));
            if (cachedSymbol != null)
            {
                result = cachedSymbol.GetLastTick();
            }
            else
            {
                var exchangeSymbol = _exchanges.SelectMany(e => e.Symbols).Where(s => s.Symbol.Equals(symbol)).FirstOrDefault();
                if (exchangeSymbol != null)
                {
                    result = HistoryHelper.GetLastTick(exchangeSymbol, _connectionString);
                }
            }
            return result;
        }

        public void ProcessExchangeSession(string exchange)
        {
            _cachedSymbols.Where(cs=>cs.Symbol.Symbol.Exchange == exchange).ToList().ForEach(cs => cs.ProcessExchangeSession());
        }
    }

    public class CachedSymbol
    {
        public ExchangeSymbol Symbol{ get; private set; }

        //cached ticks collection
        private List<Tick> _ticks;
        //last cached tick 
        private Tick _lastTick;
        private string _connectionString = null;
        //exchange settings for intraday bars calcullation
        private ExchangeSettingsEx _exchangeSettings;

        public CachedSymbol(ExchangeSymbol symbol, ExchangeSettingsEx exchangeSettings, string connectionString, Tick tick)
        {
            Symbol = symbol;
            _ticks = new List<Tick>();
            _lastTick = tick;
            _connectionString = connectionString;
            _exchangeSettings = exchangeSettings;
        }

        //process new tick
        public void AppendTick(Tick tick, bool save)
        {
            //update last cached tick 
            lock (_lastTick)
            {
                if (tick.Bid > 0 && tick.BidSize > 0)
                {
                    _lastTick.Bid = tick.Bid;
                    _lastTick.BidSize = tick.BidSize;
                }
                if (tick.Ask > 0 && tick.AskSize > 0)
                {
                    _lastTick.Ask = tick.Ask;
                    _lastTick.AskSize = tick.AskSize;
                }
                if (tick.Price > 0 && tick.Volume > 0)
                {
                    _lastTick.Price = tick.Price;
                    _lastTick.Volume = tick.Volume;
                }
                _lastTick.Time = tick.Time;
            }
            //if tick has new traded price then save it
            if (save)
            {
                if (tick.Time >= _exchangeSettings.StartDate)
                {                    
                    lock (_ticks)
                    {                        
                        if (_exchangeSettings.StartDate <= tick.Time && _exchangeSettings.EndDate > tick.Time)
                        {
                            _ticks.Add(tick);
                            if (_ticks.Count > 0) //TODO: by default: 500
                            {
                                ThreadPool.QueueUserWorkItem(o => 
                                {
                                    var ticksToFlush = (List<Tick>)o;
                                    //flush cahced ticks to DB in single transaction
                                    DataTable table = new DataTable();
                                    table.Columns.Add("SymbolID", typeof(string));
                                    table.Columns.Add("Time", typeof(DateTime));
                                    table.Columns.Add("Price", typeof(decimal));
                                    table.Columns.Add("Volume", typeof(long));
                                    table.Columns.Add("IsDeleted", typeof(bool));
                                    table.Columns.Add("Side", typeof(bool));
                                    ticksToFlush.ForEach(item => table.Rows.Add(Symbol.ID, item.Time, item.Price, item.Volume, false, item.Side));
                                    SqlConnection connection = new SqlConnection(_connectionString);
                                    SqlTransaction transaction = null;
                                    try
                                    {
                                        connection.Open();
                                        transaction = connection.BeginTransaction();
                                        SqlBulkCopy copy = new SqlBulkCopy(connection, SqlBulkCopyOptions.KeepIdentity | SqlBulkCopyOptions.CheckConstraints | SqlBulkCopyOptions.TableLock, transaction);
                                        copy.DestinationTableName = Enum.GetName(typeof(Periodicity), Periodicity.Tick);
                                        copy.WriteToServer(table);
                                        transaction.Commit();
                                    }
                                    catch (Exception ex)
                                    {
                                        if (transaction != null)
                                        {
                                            transaction.Rollback();
                                        }
                                        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                                        Log.SendEmail(string.Format("{0} Failed to write data to database: {1}", DateTime.Now.ToString(), ex.Message));
                                    }
                                    finally
                                    {
                                        if (connection.State == System.Data.ConnectionState.Open)
                                        {
                                            connection.Close();
                                        }
                                    }
                                    lock (_ticks)
                                    {
                                        try
                                        {
                                            _ticks.RemoveRange(0, Math.Min(ticksToFlush.Count, _ticks.Count));
                                        }
                                        catch (Exception ex)
                                        {
                                            Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                                            Log.SendEmail(string.Format("{0} Failed to write data to database: {1}", DateTime.Now.ToString(), ex.Message));
                                        }
                                    }
                                    GC.Collect();
                                }, _ticks.ToList());
                            }
                        }
                    }
                }
            }
        }

        public List<Bar> GetHistory(HistoryParameters request)
        {
            List<Tick> cachedTicks;
            lock (_ticks)
            {
                cachedTicks = _ticks.ToList();
            }
            return HistoryHelper.GetHistory(request, cachedTicks, _connectionString, _exchangeSettings);
        }

        public Tick GetLastTick()
        {
            Tick result = null;
            lock (_lastTick)
            {
                result = _lastTick;
            }
            return result;
        }

        public void ProcessExchangeSession()
        {
            //store cahced ticks into database
            DataTable table = new DataTable();
            table.Columns.Add("Symbol", typeof(string));
            table.Columns.Add("Time", typeof(DateTime));
            table.Columns.Add("Price", typeof(decimal));
            table.Columns.Add("Volume", typeof(long));
            lock (_ticks)
            {
                _ticks.ForEach(item => table.Rows.Add(Symbol.ID, item.Time, item.Price, item.Volume));
            }
            SqlConnection connection = new SqlConnection(_connectionString);
            SqlTransaction transaction = null;
            try
            {
                connection.Open();
                transaction = connection.BeginTransaction();
                SqlBulkCopy copy = new SqlBulkCopy(connection, SqlBulkCopyOptions.KeepIdentity | SqlBulkCopyOptions.CheckConstraints | SqlBulkCopyOptions.TableLock, transaction);
                copy.DestinationTableName = Enum.GetName(typeof(Periodicity), Periodicity.Tick);
                copy.WriteToServer(table);
                transaction.Commit();
            }
            catch (Exception ex)
            {
                if (transaction != null)
                {
                    transaction.Rollback();
                }
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                Log.SendEmail(string.Format("{0} Failed to write data to database: {1}", DateTime.Now.ToString(), ex.Message));
            }
            finally
            {
                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }
            }
            lock (_ticks)
            {
                _ticks.Clear();
            }
            GC.Collect();            
            //get current trading session day ticks from DB
            List<Tick> ticks = new List<Tick>();
            connection = new SqlConnection(_connectionString);
            try
            {
                connection.Open();
                SqlCommand command = connection.CreateCommand();
                command.CommandText = string.Format("SELECT [TIME], [PRICE], [VOLUME], [SIDE] FROM [{0}] WHERE [SYMBOLID] = @SymbolID AND [TIME] >= @Time", Enum.GetName(typeof(Periodicity), Periodicity.Tick));
                command.Parameters.AddWithValue("SymbolID", Symbol.ID);
                command.Parameters.AddWithValue("Time", _exchangeSettings.StartDate);
                SqlDataReader reader = command.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        ticks.Add(new Tick(reader.GetDateTime(0), reader.GetDecimal(1), reader.GetInt64(2), reader.GetBoolean(3)));
                    }
                }
            }
            catch (Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                Log.SendEmail(string.Format("{0} Failed to write data to database: {1}", DateTime.Now.ToString(), ex.Message));
            }
            if (connection.State == System.Data.ConnectionState.Open)
            {
                connection.Close();
            }
            ticks = ticks.OrderBy(item => item.Time).ToList();
            {
                List<Bar> bars = new List<Bar>();
                Bar bar = new Bar();
                //create minutely bars from ticks
                ticks.ForEach(item =>
                {
                    if (bar.Time == DateTime.MinValue)
                    {
                        bar.Init(item, Periodicity.Minutely, _exchangeSettings.StartTime);
                    }
                    else
                    {
                        if (item.Time < bar.EndDate)
                        {
                            bar.AppendTick(item);
                        }
                        else
                        {
                            bars.Add(new Bar(bar.EndDate, bar.Open, bar.High, bar.Low, bar.Close, bar.Volume, bar.Side));
                            bar.Init(item, Periodicity.Minutely, _exchangeSettings.StartTime);
                        }
                    }
                });
                if (bars.Count == 0 || (bars.Count > 0 && bar.Time > bars.Last().Time))
                {
                    if (bar.Open > 0 && bar.High > 0 && bar.Low > 0 && bar.Close > 0)
                    {
                        bars.Add(new Bar(bar.EndDate, bar.Open, bar.High, bar.Low, bar.Close, bar.Volume, bar.Side));
                    }
                }
                table = new DataTable();
                table.Columns.Add("SymbolID", typeof(string));
                table.Columns.Add("Time", typeof(DateTime));
                table.Columns.Add("Open", typeof(decimal));
                table.Columns.Add("High", typeof(decimal));
                table.Columns.Add("Low", typeof(decimal));
                table.Columns.Add("Close", typeof(decimal));
                table.Columns.Add("Volume", typeof(long));
                bars.ForEach(item => table.Rows.Add(Symbol.ID, item.Time, item.Open, item.High, item.Low, item.Close, item.Volume));
                connection = new SqlConnection(_connectionString);
                //remove current trading session day minute bars(just for case) from DB and store created minute bars in DB in single transaction
                transaction = null;
                try
                {
                    connection.Open();
                    transaction = connection.BeginTransaction();
                    SqlCommand command = connection.CreateCommand();
                    //command.CommandText = string.Format("DELETE FROM [{0}] WHERE [SYMBOLID] = @SymbolID AND [Time] >= @StartDate", Enum.GetName(typeof(Periodicity), Periodicity.Minutely));
                    command.CommandText = string.Format("UPDATE [{0}] SET [IsDeleted] = 1 WHERE [SYMBOLID] = @SymbolID AND [Time] >= @StartDate", Enum.GetName(typeof(Periodicity), Periodicity.Minutely));
                    command.Parameters.AddWithValue("SymbolID", Symbol.ID);
                    command.Parameters.AddWithValue("StartDate", _exchangeSettings.StartDate);
                    command.Transaction = transaction;
                    command.ExecuteNonQuery();
                    SqlBulkCopy copy = new SqlBulkCopy(connection, SqlBulkCopyOptions.KeepIdentity | SqlBulkCopyOptions.CheckConstraints | SqlBulkCopyOptions.TableLock, transaction);
                    copy.DestinationTableName = string.Format("{0}", Enum.GetName(typeof(Periodicity), Periodicity.Minutely));
                    copy.WriteToServer(table);
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    if (transaction != null)
                    {
                        transaction.Rollback();
                    }
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                    Log.SendEmail(string.Format("{0} Failed to write data to database: {1}", DateTime.Now.ToString(), ex.Message));
                }
                finally
                {
                    if (connection.State == System.Data.ConnectionState.Open)
                    {
                        connection.Close();
                    }
                }
            }
            {
                List<Bar> bars = new List<Bar>();
                Bar bar = new Bar();
                //create daily bar from ticks
                ticks.ForEach(item =>
                {
                    if (bar.Time == DateTime.MinValue)
                    {
                        bar.Init(item, Periodicity.Daily, _exchangeSettings.StartTime);
                    }
                    else
                    {
                        if (item.Time < bar.EndDate)
                        {
                            bar.AppendTick(item);
                        }
                        else
                        {
                            bars.Add(new Bar(bar.Time, bar.Open, bar.High, bar.Low, bar.Close, bar.Volume, bar.Side));
                            bar.Init(item, Periodicity.Daily, _exchangeSettings.StartTime);
                        }
                    }
                });
                if (bars.Count == 0 || (bars.Count > 0 && bar.Time > bars.Last().Time))
                {
                    if (bar.Open > 0 && bar.High > 0 && bar.Low > 0 && bar.Close > 0)
                    {
                        bars.Add(new Bar(bar.Time, bar.Open, bar.High, bar.Low, bar.Close, bar.Volume, bar.Side));
                    }
                }
                table = new DataTable();
                table.Columns.Add("SymbolID", typeof(string));
                table.Columns.Add("Time", typeof(DateTime));
                table.Columns.Add("Open", typeof(decimal));
                table.Columns.Add("High", typeof(decimal));
                table.Columns.Add("Low", typeof(decimal));
                table.Columns.Add("Close", typeof(decimal));
                table.Columns.Add("Volume", typeof(long));
                bars.ForEach(item => table.Rows.Add(Symbol.ID, item.Time, item.Open, item.High, item.Low, item.Close, item.Volume));
                connection = new SqlConnection(_connectionString);
                //remove current trading session day daily bars(just for case) from database and store created daily bar in DB in single transaction
                transaction = null;
                try
                {
                    connection.Open();
                    transaction = connection.BeginTransaction();
                    SqlCommand command = connection.CreateCommand();
                    //command.CommandText = string.Format("DELETE FROM [{0}] WHERE [SYMBOLID] = @SymbolID AND [Time] >= @StartDate", Enum.GetName(typeof(Periodicity), Periodicity.Daily));
                    command.CommandText = string.Format("UPDATE [{0}] SET [IsDeleted] = 1 WHERE [SYMBOLID] = @SymbolID AND [Time] >= @StartDate", Enum.GetName(typeof(Periodicity), Periodicity.Daily));
                    command.Parameters.AddWithValue("SymbolID", Symbol.ID);
                    command.Parameters.AddWithValue("StartDate", _exchangeSettings.StartDate);
                    command.Transaction = transaction;
                    command.ExecuteNonQuery();
                    SqlBulkCopy copy = new SqlBulkCopy(connection, SqlBulkCopyOptions.KeepIdentity | SqlBulkCopyOptions.CheckConstraints | SqlBulkCopyOptions.TableLock, transaction);
                    copy.DestinationTableName = string.Format("{0}", Enum.GetName(typeof(Periodicity), Periodicity.Daily));
                    copy.WriteToServer(table);
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    if (transaction != null)
                    {
                        transaction.Rollback();
                    }
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                    Log.SendEmail(string.Format("{0} Failed to write data to database: {1}", DateTime.Now.ToString(), ex.Message));
                }
                finally
                {
                    if (connection.State == System.Data.ConnectionState.Open)
                    {
                        connection.Close();
                    }
                }
            }
            //remove current trading session day ticks from DB
            try
            {
                connection.Open();
                SqlCommand command = connection.CreateCommand();
                //command.CommandText = string.Format("DELETE FROM [{0}] WHERE [SYMBOLID] = @SymbolID AND [Time] <= @EndDate", Enum.GetName(typeof(Periodicity), Periodicity.Tick));
                command.CommandText = string.Format("UPDATE [{0}] SET [IsDeleted] = 1 WHERE [SYMBOLID] = @SymbolID AND [Time] <= @EndDate", Enum.GetName(typeof(Periodicity), Periodicity.Tick));
                command.Parameters.AddWithValue("SymbolID", Symbol.ID);
                command.Parameters.AddWithValue("EndDate", _exchangeSettings.EndDate);
                command.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                Log.SendEmail(string.Format("{0} Failed to write data to database: {1}", DateTime.Now.ToString(), ex.Message));
            }
            finally
            {
                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }
            }
            _exchangeSettings.UpdateDateTime();            
        }
    }

    public static class HistoryHelper
    {
        //get base periodicity bars(Tick, Minutely, Daily) from Db
        public static List<Bar> GetHistory(HistoryParameters request, List<Tick> cachedTicks, string connectionString, ExchangeSettingsEx exchangeSettings)
        {
            List<Bar> result = new List<Bar>();
            var exchangeSymbol = exchangeSettings.Symbols.FirstOrDefault(s => s.Symbol.Equals(request.Symbol));
            if (exchangeSymbol != null)
            {
                if (request.Periodicity == Periodicity.Tick)
                {
                    List<Tick> ticks = new List<Tick>();
                    SqlConnection connection = new SqlConnection(connectionString);
                    try
                    {
                        connection.Open();
                        SqlCommand command = connection.CreateCommand();
                        command.CommandText = string.Format("SELECT TOP {0} [Time], [PRICE], [VOLUME], [SIDE] FROM [{1}] WHERE [SYMBOLID] = @Symbol ORDER BY [Time] DESC", request.BarsCount * request.Interval - ticks.Count, Enum.GetName(typeof(Periodicity), Periodicity.Tick));
                        command.Parameters.AddWithValue("@Symbol", exchangeSymbol.ID);
                        //command.Parameters.AddWithValue("SymbolID", exchangeSymbol.ID);
                        SqlDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                ticks.Add(new Tick(reader.GetDateTime(0), reader.GetDecimal(1), reader.GetInt64(2), reader.GetBoolean(3)));
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                    }
                    if (connection.State == System.Data.ConnectionState.Open)
                    {
                        connection.Close();
                    }
                    ticks.AddRange(cachedTicks);
                    ticks = ticks.OrderBy(bar => bar.Time).ToList();
                    Bar currentBar = new Bar();
                    int index = 0;
                    for (int k = ticks.Count - 1; k >= 0; k--)
                    {
                        if (index == 0)
                        {
                            currentBar = new Bar(ticks[k].Time, ticks[k].Price, ticks[k].Price, ticks[k].Price, ticks[k].Price, ticks[k].Volume, ticks[k].Side);
                        }
                        else
                        {
                            currentBar.SetDate(ticks[k].Time);
                            currentBar.Open = ticks[k].Price;
                            currentBar.High = Math.Max(currentBar.High, ticks[k].Price);
                            currentBar.Low = Math.Min(currentBar.Low, ticks[k].Price);
                            currentBar.Volume += ticks[k].Volume;
                        }
                        index++;
                        if (index == request.Interval)
                        {
                            result.Add(new Bar(currentBar.Time, currentBar.Open, currentBar.High, currentBar.Low, currentBar.Close, currentBar.Volume, currentBar.Side));
                            index = 0;
                            currentBar = null;
                        }
                    }
                    if (currentBar != null)
                    {
                        result.Add(currentBar);
                    }
                }
                else
                {
                    Periodicity compressPeriodicity = Periodicity.Minutely;
                    switch (request.Periodicity)
                    {
                        case Periodicity.Secondly:
                            compressPeriodicity = Periodicity.Tick;
                            break;
                        case Periodicity.Minutely:
                        case Periodicity.Hourly:
                            compressPeriodicity = Periodicity.Minutely;
                            break;
                        case Periodicity.Daily:
                        case Periodicity.Weekly:
                        case Periodicity.Monthly:
                            compressPeriodicity = Periodicity.Daily;
                            break;
                    }
                    List<Tick> ticks = new List<Tick>(cachedTicks);
                    SqlConnection connection = new SqlConnection(connectionString);
                    try
                    {
                        connection.Open();
                        SqlCommand command = connection.CreateCommand();
                        command.CommandText = string.Format("SELECT [Time], [PRICE], [VOLUME], [SIDE] FROM [{0}]  WHERE [SYMBOLID] = @SymbolID AND [Time] >= @Date", Enum.GetName(typeof(Periodicity), Periodicity.Tick));
                        command.Parameters.AddWithValue("SymbolID", exchangeSymbol.ID);
                        command.Parameters.AddWithValue("Date", exchangeSettings.StartDate);
                        SqlDataReader reader = command.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                ticks.Add(new Tick(reader.GetDateTime(0), reader.GetDecimal(1), reader.GetInt64(2), reader.GetBoolean(3)));
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                    }
                    if (connection.State == System.Data.ConnectionState.Open)
                    {
                        connection.Close();
                    }
                    ticks = ticks.OrderBy(tick => tick.Time).ToList();
                    List<Bar> bars = new List<Bar>();
                    Bar bar = new Bar();
                    ticks.ForEach(item =>
                    {
                        if (bar.Time == DateTime.MinValue)
                        {
                            bar.Init(item, compressPeriodicity, exchangeSettings.StartTime);
                        }
                        else
                        {
                            if (item.Time < bar.EndDate)
                            {
                                bar.AppendTick(item);
                            }
                            else
                            {
                                if (compressPeriodicity == Periodicity.Minutely || compressPeriodicity == Periodicity.Hourly)
                                {
                                    bars.Add(new Bar(bar.EndDate, bar.Open, bar.High, bar.Low, bar.Close, bar.Volume, bar.Side));
                                }
                                else
                                {
                                    bars.Add(new Bar(bar.Time, bar.Open, bar.High, bar.Low, bar.Close, bar.Volume, bar.Side));
                                }
                                bar.Init(item, compressPeriodicity, exchangeSettings.StartTime);
                            }
                        }
                    });
                    if (bars.Count == 0 || (bars.Count > 0 && bar.Time > bars.Last().Time))
                    {
                        if (bar.Open > 0 && bar.High > 0 && bar.Low > 0 && bar.Close > 0)
                        {
                            if (compressPeriodicity == Periodicity.Minutely || compressPeriodicity == Periodicity.Hourly)
                            {
                                bars.Add(new Bar(bar.EndDate, bar.Open, bar.High, bar.Low, bar.Close, bar.Volume, bar.Side));
                            }
                            else
                            {
                                bars.Add(new Bar(bar.Time, bar.Open, bar.High, bar.Low, bar.Close, bar.Volume, bar.Side));
                            }
                        }
                    }
                    if (compressPeriodicity == Periodicity.Daily && bars.Count > 0)
                    {
                        bar = null;
                        connection = new SqlConnection(connectionString);
                        try
                        {
                            connection.Open();
                            SqlCommand command = connection.CreateCommand();
                            command.CommandText = string.Format("SELECT TOP 1 [Time], [OPEN], [HIGH], [LOW], [CLOSE], [VOLUME], [SIDE] FROM [{0}] WHERE [SYMBOLID] = @SymbolID ORDER BY [Time] DESC", Enum.GetName(typeof(Periodicity), compressPeriodicity));
                            command.Parameters.AddWithValue("SymbolID", exchangeSymbol.ID);
                            SqlDataReader reader = command.ExecuteReader();
                            if (reader.HasRows)
                            {
                                reader.Read();
                                bar = new Bar(reader.GetDateTime(0), reader.GetDecimal(1), reader.GetDecimal(2), reader.GetDecimal(3), reader.GetDecimal(4), reader.GetInt64(5), reader.GetBoolean(6));
                            }
                        }
                        catch (Exception ex)
                        {
                            Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                        }
                        if (connection.State == System.Data.ConnectionState.Open)
                        {
                            connection.Close();
                        }
                        if (bar != null && bars[0].Time < bar.Time)
                        {
                            bars[0].Open = bar.Open;
                            bars[0].High = Math.Max(bar.High, bars[0].High);
                            bars[0].Low = Math.Min(bar.Low, bars[0].Low);
                            bars[0].Volume += bars[0].Volume;
                        }
                    }
                    if (bars.Count / request.Interval < request.BarsCount && compressPeriodicity != Periodicity.Tick)
                    {
                        int cachedBarsCount = request.BarsCount - bars.Count / request.Interval;
                        connection = new SqlConnection(connectionString);
                        try
                        {
                            connection.Open();
                            SqlCommand command = connection.CreateCommand();
                            command.CommandText = string.Format("SELECT TOP {0} [Time], [OPEN], [HIGH], [LOW], [CLOSE], [VOLUME], [SIDE] FROM [{1}] WHERE [SYMBOLID] = @SymbolID ORDER BY [Time] DESC", cachedBarsCount, Enum.GetName(typeof(Periodicity), compressPeriodicity));
                            command.Parameters.AddWithValue("SymbolID", exchangeSymbol.ID);
                            SqlDataReader reader = command.ExecuteReader();
                            if (reader.HasRows)
                            {
                                while (reader.Read())
                                {
                                    bars.Add(new Bar(reader.GetDateTime(0), reader.GetDecimal(1), reader.GetDecimal(2), reader.GetDecimal(3), reader.GetDecimal(4), reader.GetInt64(5), reader.GetBoolean(6)));
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                        }
                        if (connection.State == System.Data.ConnectionState.Open)
                        {
                            connection.Close();
                        }
                    }
                    bars = bars.OrderBy(item => item.Time).ToList();
                    if ((request.Periodicity == Periodicity.Minutely || request.Periodicity == Periodicity.Daily) && (request.Interval == 1))
                    {
                        result.AddRange(bars);
                    }
                    else
                    {
                        bar = new Bar();
                        bars.ForEach(item =>
                        {
                            if (bar.Time == DateTime.MinValue)
                            {
                                bar.Init(item, request.Periodicity, request.Interval, exchangeSettings.StartTime);
                            }
                            else
                            {
                                if (item.Time <= bar.EndDate)
                                {
                                    bar.AppendBar(item);
                                }
                                else
                                {
                                    if (request.Periodicity == Periodicity.Minutely || request.Periodicity == Periodicity.Hourly)
                                    {
                                        result.Add(new Bar(bar.EndDate, bar.Open, bar.High, bar.Low, bar.Close, bar.Volume, bar.Side));
                                    }
                                    else
                                    {
                                        result.Add(new Bar(bar.EndDate, bar.Open, bar.High, bar.Low, bar.Close, bar.Volume, bar.Side));
                                    }
                                    bar.Init(item, request.Periodicity, request.Interval, exchangeSettings.StartTime);
                                }
                            }
                        });
                        if (result.Count == 0 || (result.Count > 0 && bar.Time > result.Last().Time))
                        {
                            if (bar.Open > 0 && bar.High > 0 && bar.Low > 0 && bar.Close > 0)
                            {
                                bar.SetDate(request.Periodicity != Periodicity.Daily ? bar.EndDate : bar.EndDate.Date.AddDays(-1));
                                result.Add(bar);
                            }
                        }
                    }
                    result = result.OrderByDescending(item => item.Time).Take(request.BarsCount).OrderBy(item => item.Time).ToList();
                }
            }
            return result;
        }

        //get last tick from DB
        public static Tick GetLastTick(ExchangeSymbol symbol, string connectionString)
        {
            Tick result = null;
            SqlConnection connection = new SqlConnection(connectionString);
            try
            {
                connection.Open();
                SqlCommand command = connection.CreateCommand();
                command.CommandText = string.Format("SELECT TOP 1 [Time], [PRICE], [VOLUME], [SIDE] FROM [{0}] WHERE [SYMBOLID] = @SymbolID ORDER BY [Time] DESC", Enum.GetName(typeof(Periodicity), Periodicity.Tick));
                command.Parameters.AddWithValue("SymbolID", symbol.ID);
                SqlDataReader reader = command.ExecuteReader();
                if (reader.HasRows && reader.Read())
                {
                    result = new Tick(symbol.Symbol, reader.GetDateTime(0), reader.GetDecimal(1), reader.GetInt64(2), reader.GetBoolean(3));
                }
            }
            catch (Exception ex)
            {
                Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
            }
            if (connection.State == System.Data.ConnectionState.Open)
            {
                connection.Close();
            }
            if (result == null)
            {
                connection = new SqlConnection(connectionString);
                try
                {
                    connection.Open();
                    SqlCommand command = connection.CreateCommand();
                    command.CommandText = string.Format("SELECT TOP 1 [Time], [Close], [Volume], [Side] FROM [{0}] WHERE [SYMBOLID] = @SymbolID ORDER BY [Time] DESC", Enum.GetName(typeof(Periodicity), Periodicity.Daily));
                    command.Parameters.AddWithValue("SymbolID", symbol.ID);
                    SqlDataReader reader = command.ExecuteReader();
                    if (reader.HasRows && reader.Read())
                    {
                        result = new Tick(symbol.Symbol, reader.GetDateTime(0), reader.GetDecimal(1), reader.GetInt64(2), reader.GetBoolean(3));
                    }
                }
                catch (Exception ex)
                {
                    Log.WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                }
                if (connection.State == System.Data.ConnectionState.Open)
                {
                    connection.Close();
                }
            }
            return result;
        }
    }

    public class Log
    {
        public static void WriteApplicationInfo(string info)
        {
           string logPath = Path.Combine(Path.GetDirectoryName(Path.GetDirectoryName(new UriBuilder(Assembly.GetExecutingAssembly().GetName().CodeBase).Path)), @"App_Data\Logs\ApplicationInfo\");
            if (!Directory.Exists(logPath))
            {
                try
                {
                    Directory.CreateDirectory(logPath);
                }
                catch { }
            }
            if (Directory.Exists(logPath))
            {
                try
                {
                    FileStream fileStream = new FileStream(Path.Combine(logPath, DateTime.Now.ToString("yyyy_MM_dd") + "_ApplicationInfoLog.txt"), FileMode.Append);
                    StreamWriter writer = new StreamWriter(fileStream);
                    writer.WriteLine(string.Format("Date: {0} Data: {1} Info: ", DateTime.Now, info));
                    writer.Close();
                    fileStream.Close();
                }
                catch { }
            }
        }
        //log application internal error 
        public static void WriteApplicationInfo(string info, string user)
        {
            string logPath = Path.Combine(Path.GetDirectoryName(Path.GetDirectoryName(new UriBuilder(Assembly.GetExecutingAssembly().GetName().CodeBase).Path)), @"App_Data\Logs\Users\", user);
            if (!Directory.Exists(logPath))
            {
                try
                {
                    Directory.CreateDirectory(logPath);
                }
                catch { }
            }
            if (Directory.Exists(logPath))
            {
                try
                {
                    FileStream fileStream = new FileStream(Path.Combine(logPath, DateTime.Now.ToString("yyyy_MM_dd_") + user + "_InfoLog.txt"), FileMode.Append);
                    StreamWriter writer = new StreamWriter(fileStream);
                    writer.WriteLine(string.Format("Date: {0} Data: {1} Info: ", DateTime.Now, info));
                    writer.Close();
                    fileStream.Close();
                }
                catch { }
            }
        }

        public static void WriteApplicationSingIn(string info, string user)
        {
            string logPath = Path.Combine(Path.GetDirectoryName(Path.GetDirectoryName(new UriBuilder(Assembly.GetExecutingAssembly().GetName().CodeBase).Path)), @"App_Data\Logs\SingIn\");
            if (!Directory.Exists(logPath))
            {
                try
                {
                    Directory.CreateDirectory(logPath);
                }
                catch { }
            }
            if (Directory.Exists(logPath))
            {
                try
                {
                    FileStream fileStream = new FileStream(Path.Combine(logPath, "SingInLog.txt"), FileMode.Append);
                    StreamWriter writer = new StreamWriter(fileStream);
                    writer.WriteLine(string.Format("User: {0} Date: {1} Info: {2} ", user, DateTime.Now, info));
                    writer.Close();
                    fileStream.Close();
                }
                catch { }
            }
        }

        //log application exception 
        public static void WriteMatchExecutions(NewOrderRequest request1, NewOrderRequest request2, Execution execution1, Execution execution2, string user)
        {
            string logPath = Path.Combine(Path.GetDirectoryName(Path.GetDirectoryName(new UriBuilder(Assembly.GetExecutingAssembly().GetName().CodeBase).Path)), @"App_Data\Logs\Users\", user);
            if (!Directory.Exists(logPath))
            {
                try
                {
                    Directory.CreateDirectory(logPath);
                }
                catch { }
            }
            if (Directory.Exists(logPath))
            {
                try
                {
                    FileStream fileStream = new FileStream(Path.Combine(logPath, DateTime.Now.ToString("yyyy_MM_dd_") + user + "_ExecutionsLog.txt"), FileMode.Append);
                    StreamWriter writer = new StreamWriter(fileStream);
                    writer.WriteLine(string.Format("**********{0}Order1: {1}{0}{0}Order2: {2}{0}{0}Execution1: {3}{0}{0}Execution2: {4}{0}**********{0}", Environment.NewLine, request1, request2, execution1, execution2));
                    writer.Close();
                    fileStream.Close();
                }
                catch { }
            }
        }

        //log application exception 
        public static void WriteApplicationException(string className, string methodName, int lineNumber, Exception exception)
        {
            string logPath = Path.Combine(Path.GetDirectoryName(Path.GetDirectoryName(new UriBuilder(Assembly.GetExecutingAssembly().GetName().CodeBase).Path)), @"App_Data\Logs\ApplicationException\");
            if (!Directory.Exists(logPath))
            {
                try
                {
                    Directory.CreateDirectory(logPath);
                }
                catch { }
            }
            if (Directory.Exists(logPath))
            {
                try
                {
                    FileStream fileStream = new FileStream(Path.Combine(logPath, DateTime.Now.ToString("yyyy_MM_dd") + "_ApplicationExceptionLog.txt"), FileMode.Append);
                    StreamWriter writer = new StreamWriter(fileStream);
                    writer.WriteLine(string.Format("Date: {0} ClassName: {1} MethodName: {2} Line number {3} Data: {4}\n\rStackTrace: {5}", DateTime.Now, className, methodName, lineNumber, exception.Message, exception.StackTrace));
                    writer.Close();
                    fileStream.Close();
                }
                catch { }
            }
        }

        public static void WriteApplicationException(string className, string methodName, int lineNumber, Exception exception, string user)
        {
           string logPath = Path.Combine(Path.GetDirectoryName(Path.GetDirectoryName(new UriBuilder(Assembly.GetExecutingAssembly().GetName().CodeBase).Path)), @"App_Data\Logs\Users\", user);
            if (!Directory.Exists(logPath))
            {
                try
                {
                    Directory.CreateDirectory(logPath);
                }
                catch { }
            }
            if (Directory.Exists(logPath))
            {
                try
                {
                    FileStream fileStream = new FileStream(Path.Combine(logPath, DateTime.Now.ToString("yyyy_MM_dd_") + user + "_ExceptionLog.txt"), FileMode.Append);
                    StreamWriter writer = new StreamWriter(fileStream);
                    writer.WriteLine(string.Format("Date: {0} ClassName: {1} MethodName: {2} Line number {3} Data: {4}\n\rStackTrace: {5}", DateTime.Now, className, methodName, lineNumber, exception.Message, exception.StackTrace));
                    writer.Close();
                    fileStream.Close();
                }
                catch { }
            }
        }

        //send error via email
        public static void SendEmail(string data)
        {
            return;
            ThreadPool.QueueUserWorkItem((o) =>
            {
                try
                {
                    System.Web.Mail.MailMessage eMail = new System.Web.Mail.MailMessage();
                    eMail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/smtpserver", "smtp.exmail.qq.com");
                    eMail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/smtpserverport", 465);
                    eMail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/sendusing", 2);
                    eMail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/smtpauthenticate", 1);
                    eMail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/sendusername", "jy@fx678.cn");
                    eMail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/sendpassword", "fx678.com");
                    eMail.Fields.Add("http://schemas.microsoft.com/cdo/configuration/smtpusessl", true);
                    eMail.From = "jy@fx678.cn";
                    eMail.To = "zhuzh@fx678.cn";
                    eMail.Subject = "Data server stream";
                    eMail.BodyFormat = System.Web.Mail.MailFormat.Text;
                    eMail.Body = data;
                    eMail.Priority = System.Web.Mail.MailPriority.High;
                    System.Web.Mail.SmtpMail.SmtpServer = String.Format("{0}:{1}", "smtp.exmail.qq.com", 465);
                    System.Web.Mail.SmtpMail.Send(eMail);
                }
                catch (Exception ex)
                {
                    WriteApplicationException(MethodBase.GetCurrentMethod().DeclaringType.Name, MethodBase.GetCurrentMethod().Name, new System.Diagnostics.StackFrame(0, true).GetFileLineNumber(), ex);
                }
            });
        }

        // write Payment Info
        public static void WritePaymentInfo(string info, string user)
        {
            string logPath = Path.Combine(Path.GetDirectoryName(Path.GetDirectoryName(new UriBuilder(Assembly.GetExecutingAssembly().GetName().CodeBase).Path)), @"App_Data\Logs\Payments\", user);
            if (!Directory.Exists(logPath))
            {
                try
                {
                    Directory.CreateDirectory(logPath);
                }
                catch { }
            }
            if (Directory.Exists(logPath))
            {
                try
                {
                    FileStream fileStream = new FileStream(Path.Combine(logPath, DateTime.Now.ToString("yyyy_MM_dd_") + user + "_payments.txt"), FileMode.Append);
                    StreamWriter writer = new StreamWriter(fileStream);
                    writer.WriteLine(string.Format("Date: {0} Info:{1} ", DateTime.Now, info));
                    writer.Close();
                    fileStream.Close();
                }
                catch { }
            }
        }

        // write GIDX Info
        public static void WriteGIDXInfo(string info, string user)
        {
            string logPath = Path.Combine(Path.GetDirectoryName(Path.GetDirectoryName(new UriBuilder(Assembly.GetExecutingAssembly().GetName().CodeBase).Path)), @"App_Data\Logs\GIDX\", user);
            if (!Directory.Exists(logPath))
            {
                try
                {
                    Directory.CreateDirectory(logPath);
                }
                catch { }
            }
            if (Directory.Exists(logPath))
            {
                try
                {
                    FileStream fileStream = new FileStream(Path.Combine(logPath, DateTime.Now.ToString("yyyy_MM_dd_") + user + "_gidx.txt"), FileMode.Append);
                    StreamWriter writer = new StreamWriter(fileStream);
                    writer.WriteLine(string.Format("Date: {0} Info:{1} ", DateTime.Now, info));
                    writer.Close();
                    fileStream.Close();
                }
                catch { }
            }
        }



    }

    public class GeoFromIp
    {
        private static string dbLocation = "bin\\MaxMindDb\\GeoIP2-City.mmdb";

        public static CityResponse GetCityFromIp(string ip)
        {

            var country = new CityResponse();
            using (var reader = new DatabaseReader(Path.Combine(HttpContext.Current.Server.MapPath("~"), dbLocation)))
            {
                reader.TryCity(ip, out country);
            }

            return country;
        }

        public static CityResponse GetCityFromIp(IPAddress ip)
        {
            return GetCityFromIp(ip.ToString());
        }
    }
    
    public class Category
    {
        public class CategoryItem
        {
            public Guid CatID { get; set; }
            public string CatName { get; set; }
            public Guid CatParent_id { get; set; }
            public string CatUrl { get; set; }
            public string CatIcon { get; set; }
            public int CatPosition { get; set; }
        }

        private List<CategoryItem> allCategories = null;

        private Dictionary<Guid, string> currentCategoryChain = new Dictionary<Guid, string>();
        private Dictionary<Guid, string> currentCategoryUrlChain = new Dictionary<Guid, string>(); 

        public void Initialize()
        {
            var connectionString = ConfigurationManager.ConnectionStrings["MyExchange"].ConnectionString;
            using(IDbConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                IDbCommand command = connection.CreateCommand();
                command.CommandText = "SELECT * FROM [Category] WHERE [IsDeleted] = 0";
                IDataReader reader = command.ExecuteReader();
                while(reader.Read())
                {
                    Guid id = reader.GetGuid(0);
                    string name = reader.GetString(1);
                    Guid parentId = reader.IsDBNull(2) ? Guid.Empty : reader.GetGuid(2);
                    string url = reader.GetString(3);
                    string icon = reader.IsDBNull(4) ? null : reader.GetString(4);
                    int position = reader.GetInt32(5);

                    if(allCategories == null)
                    {
                        allCategories = new List<CategoryItem>{
                            new CategoryItem
                            {
                                CatID = id,
                                CatName = name,
                                CatParent_id = parentId,
                                CatUrl = url,
                                CatIcon = icon,
                                CatPosition = position
                            }};
                    }
                    else
                    {
                        allCategories.Add(new CategoryItem
                        {
                            CatID = id,
                            CatName = name,
                            CatParent_id = parentId,
                            CatUrl = url,
                            CatIcon = icon,
                            CatPosition = position
                        });
                    }
                }
            }
        }

        public Dictionary<Guid, string> GetCategoryChain(Guid id)
        {
            var currentCategory = allCategories.First(ac => ac.CatID == id);

            currentCategoryChain.Add(currentCategory.CatID, currentCategory.CatName);

            if (currentCategory.CatParent_id != Guid.Empty)
            {
                GetCategoryChain(currentCategory.CatParent_id);
            }

            return currentCategoryChain;
        }

        public List<CategoryItem> GetCategory()
        {
            return allCategories;
        }

        public void Remove()
        {
            allCategories = null;
        }
    }
}
